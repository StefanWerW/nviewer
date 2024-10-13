"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MemoryChart } from "@/components/MemoryChart";
import { FanChart } from "@/components/FanChart";
import { ClockChart } from "@/components/ClockChart";
import { TemperatureChart } from "@/components/TemperatureCharts";

export default function IndexPage() {
  return (
    <div className="grid grid-cols-3 gap-2">
      <Card className="">
        <CardHeader>
          <CardTitle>GPU Memory</CardTitle>
          <CardDescription>MEMORY</CardDescription>
        </CardHeader>
        <CardContent>
          <MemoryChart />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>GPU Fan Speed</CardTitle>
          <CardDescription>FAN</CardDescription>
        </CardHeader>
        <CardContent>
          <FanChart />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Temperature GPU</CardTitle>
          <CardDescription>Temperature</CardDescription>
        </CardHeader>
        <CardContent>
          <TemperatureChart />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Clock Memory</CardTitle>
          <CardDescription>Clock Memory</CardDescription>
        </CardHeader>
        <CardContent>
          <ClockChart event="clockInfoMemory" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Clock Graphics</CardTitle>
          <CardDescription>Clock Graphics</CardDescription>
        </CardHeader>
        <CardContent>
          <ClockChart event="clockInfoGraphics" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Clock Video</CardTitle>
          <CardDescription>Clock Video</CardDescription>
        </CardHeader>
        <CardContent>
          <ClockChart event="clockInfoVideo" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Clock SM</CardTitle>
          <CardDescription>Clock SM</CardDescription>
        </CardHeader>
        <CardContent>
          <ClockChart event="clockInfoSm" />
        </CardContent>
      </Card>
    </div>
  );
}
