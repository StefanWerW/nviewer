use nvml_wrapper::enum_wrappers::device::Clock;
use nvml_wrapper::{enum_wrappers::device::TemperatureSensor, Nvml};
use tauri::Emitter;
use std::thread;
use std::time::{Duration, Instant};
use serde::Serialize;
use std::sync::{Arc, Mutex};

// fn print_device_info() -> Result<(), nvml_wrapper::error::NvmlError> {
//   let nvml = Nvml::init()?;
//   let device = nvml.device_by_index(0)?;

//   println!("Device name: {}", device.name()?);
//   println!("Memory: Used {} out of {} MiB", device.memory_info()?.used / 1024 / 1024, device.memory_info()?.total / 1024 / 1024);

//   println!("Temperature: {}°C", device.temperature(TemperatureSensor::Gpu)?);
//   println!("Fan speed: {}%", device.fan_speed(0)?);
//   println!("Power usage: {} W", device.power_usage()?);

//   Ok(())
// }

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct MemoryInfoEvent{
  used: u64,
  total: u64,
}



#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  //let r = print_device_info();


  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }

      // Clone the AppHandle to use it in the thread safely
      let app_handle = app.handle().clone(); // Clone the handle instead of holding a reference


      // // Use Arc<Mutex<T>> to safely share the app handle across threads
      // let app_handle = Arc::new(Mutex::new(app.handle()));

      // let handle_clone = Arc::clone(&app_handle);

      let handle = thread::spawn(move || {
        let interval = Duration::from_millis(33); // 1000 ms / 30 = 33.33 ms for ~30 times per second
        let mut last_run = Instant::now();

        
        let nvml = Nvml::init().unwrap();
        let device =  nvml.device_by_index(0).unwrap();
        
        println!("Device name: {}", device.name().unwrap());
        loop {
            if last_run.elapsed() >= interval {
              let memory_info = device.memory_info();
              match memory_info {
                Ok(memory_info) => {
                  app_handle.emit("memory", MemoryInfoEvent {
                      used: memory_info.used,
                      total: memory_info.total
                    }).unwrap()
                },
                Err(e) => {}
              }

              let fanSpeed = device.fan_speed(0);
              match fanSpeed {
                Ok(fanSpeed) => {
                  app_handle.emit("fanSpeed", fanSpeed).unwrap()
                },
                Err(e) => {}
              }

              let temperature = device.temperature(TemperatureSensor::Gpu);
              match temperature {
                Ok(temperature) => {
                  app_handle.emit("temperature", temperature).unwrap()
                },
                Err(e) => {}
              }

              let clock_info_graphics = device.clock_info(Clock::Graphics);
              match clock_info_graphics {
                Ok(clock_info_graphics) => {
                  app_handle.emit("clockInfoGraphics", clock_info_graphics).unwrap()
                },
                Err(e) => {}
              }

              let clock_info_sm = device.clock_info(Clock::SM);
              match clock_info_sm {
                Ok(clock_info_sm) => {
                  app_handle.emit("clockInfoSm", clock_info_sm).unwrap()
                },
                Err(e) => {}
              }

              let clock_info_memory = device.clock_info(Clock::Memory);
              match clock_info_memory {
                Ok(clock_info_memory) => {
                  app_handle.emit("clockInfoMemory", clock_info_memory).unwrap()
                },
                Err(e) => {}
              }

              let clock_info_video = device.clock_info(Clock::Video);
              match clock_info_video {
                Ok(clock_info_video) => {
                  app_handle.emit("clockInfoVideo", clock_info_video).unwrap()
                },
                Err(e) => {}
              }


              last_run = Instant::now();
            }

            // Sleep for a short duration to prevent busy-waiting
            thread::sleep(Duration::from_millis(1000));
        }
      });

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
