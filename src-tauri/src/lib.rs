use nvml_wrapper::enum_wrappers::device::Clock;
use nvml_wrapper::{enum_wrappers::device::TemperatureSensor, Nvml};
use tauri::Emitter;
use std::thread;
use std::time::{Duration, Instant};
use serde::Serialize;
use std::sync::{Arc, Mutex};
use tauri::{
  menu::{Menu, MenuItem},
  tray::TrayIconBuilder,
};

// #[tauri::command]
// fn get_gpu_info() -> Result<String, String> {
//   let nvml = Nvml::init()?;
// // Get the first `Device` (GPU) in the system
// let device = nvml.device_by_index(0)?;

//   let brand = device.brand()?;

//   Ok(brand)
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

      let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
      let menu = Menu::with_items(app, &[&quit_i])?;

      let tray = TrayIconBuilder::new()
        .icon(app.default_window_icon().unwrap().clone())
        .menu(&menu)
        .menu_on_left_click(true)
        .on_menu_event(|app, event| match event.id.as_ref() {
          "quit" => {
            app.exit(0);
          }
          _ => {
            println!("menu item {:?} not handled", event.id);
          }
        })
        .build(app)?;

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
