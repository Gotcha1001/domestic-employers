"use client";

import { useState, useEffect, useRef } from "react";
import * as fabric from "fabric";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

declare module "fabric" {
  interface Group {
    data?: { type: string; instructions: string };
  }
}

interface Room {
  type: string;
  instructions: string;
  position?: { x: number; y: number; width: number; height: number };
}

interface HouseLayoutEditorProps {
  rooms: Room[];
  setRooms: (rooms: Room[]) => void;
}

const HouseLayoutEditor: React.FC<HouseLayoutEditorProps> = ({
  rooms,
  setRooms,
}) => {
  const [selectedRoomType, setSelectedRoomType] = useState<string>("");
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      console.error("Canvas element is not available");
      return;
    }

    const c = new fabric.Canvas(canvasRef.current, {
      width: 500,
      height: 400,
      backgroundColor: "#f0f0f0",
    });
    setCanvas(c);

    rooms.forEach((room) => {
      if (room.position) {
        const rect = new fabric.Rect({
          left: 0,
          top: 0,
          width: room.position.width,
          height: room.position.height,
          fill: "rgba(100, 100, 255, 0.5)",
        });
        const text = new fabric.Text(room.type, {
          left: 10,
          top: 10,
          fontSize: 20,
          fill: "white",
        });
        const group = new fabric.Group([rect, text], {
          left: room.position.x,
          top: room.position.y,
        });
        group.set("data", { type: room.type, instructions: room.instructions });
        c.add(group);
      }
    });
    c.renderAll();
    console.log("Canvas initialized with rooms:", rooms);

    return () => {
      c.dispose();
    };
  }, [rooms]);

  useEffect(() => {
    if (canvas) {
      canvas.on("object:modified", () => {
        const objects = canvas.getObjects() as fabric.Group[];
        const updatedRooms = objects.map((group) => ({
          type: group.data?.type || "Unknown",
          instructions: group.data?.instructions || "",
          position:
            group.left !== undefined && group.top !== undefined
              ? {
                  x: Number(group.left),
                  y: Number(group.top),
                  width: Number(
                    (group.getObjects()[0] as fabric.Rect).width || 50
                  ),
                  height: Number(
                    (group.getObjects()[0] as fabric.Rect).height || 50
                  ),
                }
              : undefined,
        }));
        console.log("Updated rooms after modification:", updatedRooms);
        setRooms(updatedRooms);
      });
    }
  }, [canvas, setRooms]);

  const addRoom = () => {
    if (!selectedRoomType) {
      toast.error("Please select a room type.");
      return;
    }
    if (rooms.length >= 10) {
      toast.error("Maximum 10 rooms allowed.");
      return;
    }
    if (rooms.some((room) => room.type === selectedRoomType)) {
      toast.error("This room type has already been added.");
      return;
    }

    const newRoom: Room = {
      type: selectedRoomType,
      instructions: "",
      position: { x: 50, y: 50, width: 100, height: 100 },
    };
    setRooms([...rooms, newRoom]);

    if (canvas) {
      const rect = new fabric.Rect({
        left: 0,
        top: 0,
        width: newRoom.position!.width,
        height: newRoom.position!.height,
        fill: "rgba(100, 100, 255, 0.5)",
      });
      const text = new fabric.Text(newRoom.type, {
        left: 10,
        top: 10,
        fontSize: 20,
        fill: "white",
      });
      const group = new fabric.Group([rect, text], {
        left: newRoom.position!.x,
        top: newRoom.position!.y,
      });
      group.set("data", {
        type: newRoom.type,
        instructions: newRoom.instructions,
      });
      canvas.add(group);
      canvas.renderAll();
      console.log("Added room to canvas:", newRoom);
    }

    setSelectedRoomType("");
    toast.success(`${selectedRoomType} added to layout`);
  };

  const updateInstruction = (index: number, instruction: string) => {
    const updatedRooms = [...rooms];
    updatedRooms[index].instructions = instruction;
    setRooms(updatedRooms);

    if (canvas) {
      const objects = canvas.getObjects() as fabric.Group[];
      if (objects[index]) {
        objects[index].set("data", {
          ...objects[index].data,
          instructions: instruction,
        });
      }
    }
  };

  const removeRoom = (index: number) => {
    const removedRoom = rooms[index].type;
    setRooms(rooms.filter((_, i) => i !== index));

    if (canvas) {
      const objects = canvas.getObjects();
      if (objects[index]) {
        canvas.remove(objects[index]);
        canvas.renderAll();
        console.log("Removed room from canvas:", removedRoom);
      }
    }

    toast.info(`${removedRoom} removed from layout`);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Select onValueChange={setSelectedRoomType} value={selectedRoomType}>
          <SelectTrigger>
            <SelectValue placeholder="Select room type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Kitchen">Kitchen</SelectItem>
            <SelectItem value="Living Room">Living Room</SelectItem>
            <SelectItem value="Bedroom">Bedroom</SelectItem>
            <SelectItem value="Bathroom">Bathroom</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={addRoom} type="button">
          Add Room
        </Button>
      </div>
      <div>
        <h3 className="text-lg font-bold">House Layout</h3>
        <canvas ref={canvasRef} className="border border-gray-300" />
      </div>
      <div>
        <h3 className="text-lg font-bold">Rooms</h3>
        {rooms.length > 0 ? (
          rooms.map((room, index) => (
            <div key={index} className="my-2 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <label className="font-semibold">{room.type}</label>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeRoom(index)}
                >
                  Remove
                </Button>
              </div>
              <Input
                placeholder={`Enter instructions for ${room.type}`}
                value={room.instructions}
                onChange={(e) => updateInstruction(index, e.target.value)}
              />
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">
            Add rooms to provide instructions.
          </p>
        )}
      </div>
    </div>
  );
};

export default HouseLayoutEditor;
