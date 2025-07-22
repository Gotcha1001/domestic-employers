// "use client";

// import { useState, useEffect, useRef } from "react";
// import * as fabric from "fabric";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { toast } from "sonner";

// declare module "fabric" {
//   interface Group {
//     data?: { type: string; instructions: string };
//   }
// }

// interface Room {
//   type: string;
//   instructions: string;
//   position?: { x: number; y: number; width: number; height: number };
// }

// interface HouseLayoutEditorProps {
//   rooms: Room[];
//   setRooms: (rooms: Room[]) => void;
// }

// const HouseLayoutEditor: React.FC<HouseLayoutEditorProps> = ({
//   rooms,
//   setRooms,
// }) => {
//   const [selectedRoomType, setSelectedRoomType] = useState<string>("");
//   const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     if (!canvasRef.current) {
//       console.error("Canvas element is not available");
//       return;
//     }

//     const c = new fabric.Canvas(canvasRef.current, {
//       width: 500,
//       height: 400,
//       backgroundColor: "#f0f0f0",
//     });
//     setCanvas(c);

//     rooms.forEach((room) => {
//       if (room.position) {
//         const rect = new fabric.Rect({
//           left: 0,
//           top: 0,
//           width: room.position.width,
//           height: room.position.height,
//           fill: "rgba(100, 100, 255, 0.5)",
//         });
//         const text = new fabric.Text(room.type, {
//           left: 10,
//           top: 10,
//           fontSize: 20,
//           fill: "white",
//         });
//         const group = new fabric.Group([rect, text], {
//           left: room.position.x,
//           top: room.position.y,
//         });
//         group.set("data", { type: room.type, instructions: room.instructions });
//         c.add(group);
//       }
//     });
//     c.renderAll();
//     console.log("Canvas initialized with rooms:", rooms);

//     return () => {
//       c.dispose();
//     };
//   }, [rooms]);

//   useEffect(() => {
//     if (canvas) {
//       canvas.on("object:modified", () => {
//         const objects = canvas.getObjects() as fabric.Group[];
//         const updatedRooms = objects.map((group) => ({
//           type: group.data?.type || "Unknown",
//           instructions: group.data?.instructions || "",
//           position:
//             group.left !== undefined && group.top !== undefined
//               ? {
//                   x: Number(group.left),
//                   y: Number(group.top),
//                   width: Number(
//                     (group.getObjects()[0] as fabric.Rect).width || 50
//                   ),
//                   height: Number(
//                     (group.getObjects()[0] as fabric.Rect).height || 50
//                   ),
//                 }
//               : undefined,
//         }));
//         console.log("Updated rooms after modification:", updatedRooms);
//         setRooms(updatedRooms);
//       });
//     }
//   }, [canvas, setRooms]);

//   const addRoom = () => {
//     if (!selectedRoomType) {
//       toast.error("Please select a room type.");
//       return;
//     }
//     if (rooms.length >= 10) {
//       toast.error("Maximum 10 rooms allowed.");
//       return;
//     }
//     if (rooms.some((room) => room.type === selectedRoomType)) {
//       toast.error("This room type has already been added.");
//       return;
//     }

//     const newRoom: Room = {
//       type: selectedRoomType,
//       instructions: "",
//       position: { x: 50, y: 50, width: 100, height: 100 },
//     };
//     setRooms([...rooms, newRoom]);

//     if (canvas) {
//       const rect = new fabric.Rect({
//         left: 0,
//         top: 0,
//         width: newRoom.position!.width,
//         height: newRoom.position!.height,
//         fill: "rgba(100, 100, 255, 0.5)",
//       });
//       const text = new fabric.Text(newRoom.type, {
//         left: 10,
//         top: 10,
//         fontSize: 20,
//         fill: "white",
//       });
//       const group = new fabric.Group([rect, text], {
//         left: newRoom.position!.x,
//         top: newRoom.position!.y,
//       });
//       group.set("data", {
//         type: newRoom.type,
//         instructions: newRoom.instructions,
//       });
//       canvas.add(group);
//       canvas.renderAll();
//       console.log("Added room to canvas:", newRoom);
//     }

//     setSelectedRoomType("");
//     toast.success(`${selectedRoomType} added to layout`);
//   };

//   const updateInstruction = (index: number, instruction: string) => {
//     const updatedRooms = [...rooms];
//     updatedRooms[index].instructions = instruction;
//     setRooms(updatedRooms);

//     if (canvas) {
//       const objects = canvas.getObjects() as fabric.Group[];
//       if (objects[index]) {
//         objects[index].set("data", {
//           ...objects[index].data,
//           instructions: instruction,
//         });
//       }
//     }
//   };

//   const removeRoom = (index: number) => {
//     const removedRoom = rooms[index].type;
//     setRooms(rooms.filter((_, i) => i !== index));

//     if (canvas) {
//       const objects = canvas.getObjects();
//       if (objects[index]) {
//         canvas.remove(objects[index]);
//         canvas.renderAll();
//         console.log("Removed room from canvas:", removedRoom);
//       }
//     }

//     toast.info(`${removedRoom} removed from layout`);
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex gap-4">
//         <Select onValueChange={setSelectedRoomType} value={selectedRoomType}>
//           <SelectTrigger>
//             <SelectValue placeholder="Select room type" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="Kitchen">🍳Kitchen</SelectItem>
//             <SelectItem value="Living Room">🛋️Living Room</SelectItem>
//             <SelectItem value="Bedroom1">🛏️Bedroom1</SelectItem>
//             <SelectItem value="Bedroom2">🛏️Bedroom2</SelectItem>
//             <SelectItem value="Bedroom3">🛏️Bedroom3</SelectItem>
//             <SelectItem value="Bedroom4">🛏️Bedroom4</SelectItem>
//             <SelectItem value="Bathroom">🚿Bathroom</SelectItem>
//             <SelectItem value="Garage">🚗Garage</SelectItem>
//             <SelectItem value="Dining">🍽️Dining</SelectItem>
//             <SelectItem value="Laundry">👕Laundry</SelectItem>
//             <SelectItem value="Office">💼Office</SelectItem>
//           </SelectContent>
//         </Select>
//         <Button onClick={addRoom} type="button">
//           Add Room
//         </Button>
//       </div>
//       <div>
//         <h3 className="text-lg font-bold">House Layout</h3>
//         <canvas ref={canvasRef} className="border border-gray-300" />
//       </div>
//       <div>
//         <h3 className="text-lg font-bold">Rooms</h3>
//         {rooms.length > 0 ? (
//           rooms.map((room, index) => (
//             <div key={index} className="my-2 flex flex-col gap-2">
//               <div className="flex items-center gap-2">
//                 <label className="font-semibold">{room.type}</label>
//                 <Button
//                   variant="destructive"
//                   size="sm"
//                   onClick={() => removeRoom(index)}
//                 >
//                   Remove
//                 </Button>
//               </div>
//               <Input
//                 placeholder={`Enter instructions for ${room.type}`}
//                 value={room.instructions}
//                 onChange={(e) => updateInstruction(index, e.target.value)}
//               />
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-500 text-sm">
//             Add rooms to provide instructions.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default HouseLayoutEditor;
// components/HouseLayoutEditor.tsx

// "use client";

// import { useState, useEffect, useRef, useCallback } from "react";
// import * as fabric from "fabric";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { toast } from "sonner";
// import { debounce } from "lodash";

// declare module "fabric" {
//   interface Group {
//     data?: { type: string; instructions: string };
//   }
//   interface GroupProps {
//     data?: { type: string; instructions: string };
//   }
// }

// interface Room {
//   type: string;
//   instructions: string;
//   position?: { x: number; y: number; width: number; height: number };
// }

// interface HouseLayoutEditorProps {
//   rooms: Room[];
//   setRooms: (rooms: Room[]) => void;
// }

// const HouseLayoutEditor: React.FC<HouseLayoutEditorProps> = ({
//   rooms,
//   setRooms,
// }) => {
//   const [selectedRoomType, setSelectedRoomType] = useState<string>("");
//   const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   // Initialize canvas
//   useEffect(() => {
//     if (!canvasRef.current) {
//       console.error("Canvas element is not available");
//       toast.error("Failed to initialize canvas.");
//       return;
//     }

//     const c = new fabric.Canvas(canvasRef.current, {
//       width: 600,
//       height: 450,
//       backgroundColor: "#e5e7eb",
//       selection: true,
//       preserveObjectStacking: true,
//     });

//     setCanvas(c);

//     // Load existing rooms
//     rooms.forEach((room) => {
//       if (room.position) {
//         const fontSize = room.type.length > 10 ? 14 : 16;
//         const rect = new fabric.Rect({
//           left: 0,
//           top: 0,
//           width: room.position.width,
//           height: room.position.height,
//           fill: "rgba(59, 130, 246, 0.6)", // Blue with opacity
//           stroke: "#1e40af",
//           strokeWidth: 2,
//           rx: 8,
//           ry: 8,
//         });

//         const text = new fabric.Text(room.type, {
//           left: 10,
//           top: 10,
//           fontSize,
//           fill: "#ffffff",
//           fontFamily: "Inter, sans-serif",
//           fontWeight: "600",
//           textAlign: "center",
//         });

//         const group = new fabric.Group([rect, text], {
//           left: room.position.x,
//           top: room.position.y,
//           selectable: true,
//           hasControls: true,
//           lockScalingFlip: true,
//           data: { type: room.type, instructions: room.instructions },
//         });

//         c.add(group);
//       }
//     });

//     c.renderAll();

//     return () => {
//       c.dispose();
//     };
//   }, [rooms]);

//   // Handle canvas object modifications
//   const updateRooms = useCallback(
//     debounce(() => {
//       if (!canvas) return;
//       const objects = canvas.getObjects() as fabric.Group[];
//       const updatedRooms = objects.map((group) => ({
//         type: group.data?.type || "Unknown",
//         instructions: group.data?.instructions || "",
//         position:
//           group.left !== undefined && group.top !== undefined
//             ? {
//                 x: Number(group.left),
//                 y: Number(group.top),
//                 width: Number(
//                   (group.getObjects()[0] as fabric.Rect).width || 50
//                 ),
//                 height: Number(
//                   (group.getObjects()[0] as fabric.Rect).height || 50
//                 ),
//               }
//             : undefined,
//       }));
//       setRooms(updatedRooms);
//     }, 300),
//     [canvas, setRooms]
//   );

//   useEffect(() => {
//     if (canvas) {
//       canvas.on("object:modified", updateRooms);
//       return () => {
//         canvas.off("object:modified", updateRooms);
//       };
//     }
//   }, [canvas, updateRooms]);

//   const addRoom = () => {
//     if (!selectedRoomType) {
//       toast.error("Please select a room type.");
//       return;
//     }

//     if (rooms.length >= 10) {
//       toast.error("Maximum 10 rooms allowed.");
//       return;
//     }

//     if (rooms.some((room) => room.type === selectedRoomType)) {
//       toast.error("This room type has already been added.");
//       return;
//     }

//     const newRoom: Room = {
//       type: selectedRoomType,
//       instructions: "",
//       position: { x: 50, y: 50, width: 120, height: 120 },
//     };

//     setRooms([...rooms, newRoom]);

//     if (canvas) {
//       const fontSize = selectedRoomType.length > 10 ? 14 : 16;
//       const rect = new fabric.Rect({
//         left: 0,
//         top: 0,
//         width: newRoom.position!.width,
//         height: newRoom.position!.height,
//         fill: "rgba(59, 130, 246, 0.6)",
//         stroke: "#1e40af",
//         strokeWidth: 2,
//         rx: 8,
//         ry: 8,
//       });

//       const text = new fabric.Text(newRoom.type, {
//         left: 10,
//         top: 10,
//         fontSize,
//         fill: "#ffffff",
//         fontFamily: "Inter, sans-serif",
//         fontWeight: "600",
//         textAlign: "center",
//       });

//       const group = new fabric.Group([rect, text], {
//         left: newRoom.position!.x,
//         top: newRoom.position!.y,
//         selectable: true,
//         hasControls: true,
//         lockScalingFlip: true,
//         data: { type: newRoom.type, instructions: newRoom.instructions },
//       });

//       canvas.add(group);
//       canvas.setActiveObject(group);
//       canvas.renderAll();
//     }

//     setSelectedRoomType("");
//     toast.success(`${selectedRoomType} added to layout`);
//   };

//   const updateInstruction = (index: number, instruction: string) => {
//     const updatedRooms = [...rooms];
//     updatedRooms[index].instructions = instruction;
//     setRooms(updatedRooms);

//     if (canvas) {
//       const objects = canvas.getObjects() as fabric.Group[];
//       if (objects[index]) {
//         objects[index].set("data", {
//           ...objects[index].data,
//           instructions: instruction,
//         });
//       }
//     }
//   };

//   const removeRoom = (index: number) => {
//     const removedRoom = rooms[index].type;
//     setRooms(rooms.filter((_, i) => i !== index));

//     if (canvas) {
//       const objects = canvas.getObjects();
//       if (objects[index]) {
//         canvas.remove(objects[index]);
//         canvas.renderAll();
//       }
//     }

//     toast.info(`${removedRoom} removed from layout`);
//   };

//   return (
//     <div className="space-y-6 bg-white/5 p-6 rounded-lg shadow-lg">
//       <div className="flex gap-4 items-center">
//         <Select onValueChange={setSelectedRoomType} value={selectedRoomType}>
//           <SelectTrigger className="bg-purple-950/50 text-white border-purple-400">
//             <SelectValue placeholder="Select room type" />
//           </SelectTrigger>
//           <SelectContent className="bg-purple-950 text-white border-purple-400">
//             <SelectItem value="Kitchen">🍳 Kitchen</SelectItem>
//             <SelectItem value="Living Room">🛋️ Living Room</SelectItem>
//             <SelectItem value="Bedroom1">🛏️ Bedroom 1</SelectItem>
//             <SelectItem value="Bedroom2">🛏️ Bedroom 2</SelectItem>
//             <SelectItem value="Bedroom3">🛏️ Bedroom 3</SelectItem>
//             <SelectItem value="Bedroom4">🛏️ Bedroom 4</SelectItem>
//             <SelectItem value="Bathroom">🚿 Bathroom</SelectItem>
//             <SelectItem value="Garage">🚗 Garage</SelectItem>
//             <SelectItem value="Dining Room">🍽️ Dining Room</SelectItem>
//             <SelectItem value="Laundry Room">👕 Laundry Room</SelectItem>
//             <SelectItem value="Office">💼 Office</SelectItem>
//           </SelectContent>
//         </Select>
//         <Button
//           onClick={addRoom}
//           type="button"
//           className="bg-purple-600 hover:bg-purple-700"
//         >
//           Add Room
//         </Button>
//       </div>

//       <div>
//         <h3 className="text-lg font-bold text-purple-200 mb-4">House Layout</h3>
//         <div className="relative flex justify-center">
//           <canvas
//             ref={canvasRef}
//             className="border-2 border-purple-400 rounded-lg shadow-md"
//           />
//         </div>
//       </div>

//       <div>
//         <h3 className="text-lg font-bold text-purple-200 mb-4">
//           Room Instructions
//         </h3>
//         {rooms.length > 0 ? (
//           rooms.map((room, index) => (
//             <div
//               key={index}
//               className="my-4 flex flex-col gap-3 bg-purple-950/20 p-4 rounded-md"
//             >
//               <div className="flex items-center justify-between">
//                 <label className="font-semibold text-purple-100">
//                   {room.type}
//                 </label>
//                 <Button
//                   variant="destructive"
//                   size="sm"
//                   onClick={() => removeRoom(index)}
//                   className="bg-red-600 hover:bg-red-700"
//                 >
//                   Remove
//                 </Button>
//               </div>
//               <Input
//                 placeholder={`Enter instructions for ${room.type}`}
//                 value={room.instructions}
//                 onChange={(e) => updateInstruction(index, e.target.value)}
//                 className="bg-purple-950/50 text-white border-purple-400 placeholder-purple-300"
//                 maxLength={500}
//               />
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-400 text-sm">
//             Add rooms to provide instructions.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default HouseLayoutEditor;
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
import { debounce } from "lodash";

declare module "fabric" {
  interface Group {
    data?: { type: string; instructions: string };
  }
  interface GroupProps {
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
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: 600,
    height: 450,
  });
  const isInitializing = useRef(false);
  const resizeTimeoutRef = useRef<NodeJS.Timeout>();

  // Calculate responsive canvas dimensions
  const calculateCanvasDimensions = useCallback(() => {
    if (!containerRef.current) return { width: 600, height: 450 };

    const containerWidth = containerRef.current.clientWidth;
    const maxWidth = Math.min(containerWidth - 32, 600); // 32px for padding
    const aspectRatio = 4 / 3; // 600:450 ratio
    const height = maxWidth / aspectRatio;

    return {
      width: Math.max(280, maxWidth), // Minimum width for mobile
      height: Math.max(210, height), // Minimum height for mobile
    };
  }, []);

  // Create room visual elements
  const createRoomElements = useCallback(
    (room: Room, scaleX: number, scaleY: number) => {
      if (!room.position) return null;

      const scaledWidth = room.position.width * scaleX;
      const scaledHeight = room.position.height * scaleY;
      const scaledX = room.position.x * scaleX;
      const scaledY = room.position.y * scaleY;

      const baseFontSize = room.type.length > 10 ? 14 : 16;
      const scaledFontSize = Math.max(
        10,
        baseFontSize * Math.min(scaleX, scaleY)
      );

      const rect = new fabric.Rect({
        left: 0,
        top: 0,
        width: scaledWidth,
        height: scaledHeight,
        fill: "rgba(59, 130, 246, 0.6)",
        stroke: "#1e40af",
        strokeWidth: Math.max(1, 2 * Math.min(scaleX, scaleY)),
        rx: Math.max(4, 8 * Math.min(scaleX, scaleY)),
        ry: Math.max(4, 8 * Math.min(scaleX, scaleY)),
      });

      const text = new fabric.Text(room.type, {
        left: Math.max(5, 10 * scaleX),
        top: Math.max(5, 10 * scaleY),
        fontSize: scaledFontSize,
        fill: "#ffffff",
        fontFamily: "Inter, sans-serif",
        fontWeight: "600",
        textAlign: "center",
        selectable: false,
      });

      const group = new fabric.Group([rect, text], {
        left: scaledX,
        top: scaledY,
        selectable: true,
        hasControls: true,
        lockScalingFlip: true,
        data: { type: room.type, instructions: room.instructions },
      });

      return group;
    },
    []
  );

  // Initialize canvas once
  useEffect(() => {
    if (!canvasRef.current || isInitializing.current) return;

    isInitializing.current = true;

    try {
      const newDimensions = calculateCanvasDimensions();

      const c = new fabric.Canvas(canvasRef.current, {
        width: newDimensions.width,
        height: newDimensions.height,
        backgroundColor: "#e5e7eb",
        selection: true,
        preserveObjectStacking: true,
      });

      setCanvas(c);
      setCanvasDimensions(newDimensions);
      setIsCanvasReady(true);
    } catch (e) {
      console.error("Error initializing canvas:", e);
      toast.error("Failed to initialize canvas.");
    } finally {
      isInitializing.current = false;
    }
  }, []); // Empty dependency array - only run once

  // Load rooms into canvas when canvas is ready or rooms change
  useEffect(() => {
    if (!canvas || !isCanvasReady) return;

    // Clear existing objects
    canvas.clear();

    const scaleX = canvasDimensions.width / 600;
    const scaleY = canvasDimensions.height / 450;

    // Add rooms to canvas
    rooms.forEach((room) => {
      const group = createRoomElements(room, scaleX, scaleY);
      if (group) {
        canvas.add(group);
      }
    });

    canvas.renderAll();
  }, [canvas, isCanvasReady, rooms, canvasDimensions, createRoomElements]);

  // Handle canvas object modifications
  const updateRoomsFromCanvas = useCallback(
    debounce(() => {
      if (!canvas || !isCanvasReady) return;

      const objects = canvas.getObjects() as fabric.Group[];
      const scaleX = canvasDimensions.width / 600;
      const scaleY = canvasDimensions.height / 450;

      const updatedRooms = objects.map((group) => ({
        type: group.data?.type || "Unknown",
        instructions: group.data?.instructions || "",
        position:
          group.left !== undefined && group.top !== undefined
            ? {
                x: Number(group.left) / scaleX,
                y: Number(group.top) / scaleY,
                width:
                  Number((group.getObjects()[0] as fabric.Rect).width || 50) /
                  scaleX,
                height:
                  Number((group.getObjects()[0] as fabric.Rect).height || 50) /
                  scaleY,
              }
            : undefined,
      }));

      setRooms(updatedRooms);
    }, 300),
    [canvas, isCanvasReady, canvasDimensions, setRooms]
  );

  // Set up canvas event listeners
  useEffect(() => {
    if (!canvas || !isCanvasReady) return;

    canvas.on("object:modified", updateRoomsFromCanvas);

    return () => {
      canvas.off("object:modified", updateRoomsFromCanvas);
    };
  }, [canvas, isCanvasReady, updateRoomsFromCanvas]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      resizeTimeoutRef.current = setTimeout(() => {
        if (!canvas || !containerRef.current) return;

        const newDimensions = calculateCanvasDimensions();

        if (
          Math.abs(newDimensions.width - canvasDimensions.width) > 10 ||
          Math.abs(newDimensions.height - canvasDimensions.height) > 10
        ) {
          canvas.setDimensions(newDimensions);
          setCanvasDimensions(newDimensions);
          canvas.renderAll();
        }
      }, 200);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [canvas, canvasDimensions, calculateCanvasDimensions]);

  // Cleanup canvas on unmount
  useEffect(() => {
    return () => {
      if (canvas) {
        try {
          canvas.dispose();
        } catch (e) {
          console.error("Error disposing canvas:", e);
        }
      }
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [canvas]);

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
      position: { x: 50, y: 50, width: 120, height: 120 },
    };

    setRooms([...rooms, newRoom]);
    setSelectedRoomType("");
    toast.success(`${selectedRoomType} added to layout`);
  };

  const updateInstruction = (index: number, instruction: string) => {
    const updatedRooms = [...rooms];
    updatedRooms[index].instructions = instruction;
    setRooms(updatedRooms);

    // Update canvas object data
    if (canvas && isCanvasReady) {
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
    const updatedRooms = rooms.filter((_, i) => i !== index);
    setRooms(updatedRooms);
    toast.info(`${removedRoom} removed from layout`);
  };

  return (
    <div className="space-y-6 bg-white/5 p-6 rounded-lg shadow-lg w-full">
      <div className="flex gap-4 items-center">
        <Select onValueChange={setSelectedRoomType} value={selectedRoomType}>
          <SelectTrigger className="bg-purple-950/50 text-white border-purple-400">
            <SelectValue placeholder="Select room type" />
          </SelectTrigger>
          <SelectContent className="bg-purple-950 text-white border-purple-400">
            <SelectItem value="Kitchen">🍳 Kitchen</SelectItem>
            <SelectItem value="Living Room">🛋️ Living Room</SelectItem>
            <SelectItem value="Bedroom1">🛏️ Bedroom 1</SelectItem>
            <SelectItem value="Bedroom2">🛏️ Bedroom 2</SelectItem>
            <SelectItem value="Bedroom3">🛏️ Bedroom 3</SelectItem>
            <SelectItem value="Bedroom4">🛏️ Bedroom 4</SelectItem>
            <SelectItem value="Bathroom">🚿 Bathroom</SelectItem>
            <SelectItem value="Garage">🚗 Garage</SelectItem>
            <SelectItem value="Dining Room">🍽️ Dining Room</SelectItem>
            <SelectItem value="Laundry Room">👕 Laundry Room</SelectItem>
            <SelectItem value="Office">💼 Office</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={addRoom}
          type="button"
          className="bg-purple-600 hover:bg-purple-700"
          aria-label="Add a room to the house layout"
        >
          Add Room
        </Button>
      </div>

      <div>
        <h3 className="text-lg font-bold text-purple-200 mb-4">House Layout</h3>
        <div ref={containerRef} className="relative w-full overflow-hidden">
          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              className="border-2 border-purple-400 rounded-lg shadow-md max-w-full h-auto"
              style={{
                width: canvasDimensions.width,
                height: canvasDimensions.height,
              }}
              aria-label="House layout editor canvas"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-purple-200 mb-4">
          Room Instructions
        </h3>
        {rooms.length > 0 ? (
          rooms.map((room, index) => (
            <div
              key={`${room.type}-${index}`}
              className="my-4 flex flex-col gap-3 bg-purple-950/20 p-4 rounded-md"
            >
              <div className="flex items-center justify-between">
                <label className="font-semibold text-purple-200">
                  {room.type}
                </label>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeRoom(index)}
                  className="bg-red-600 hover:bg-red-700"
                  aria-label={`Remove ${room.type} from the house layout`}
                >
                  Remove
                </Button>
              </div>
              <Input
                placeholder={`Enter instructions for ${room.type}`}
                value={room.instructions}
                onChange={(e) => updateInstruction(index, e.target.value)}
                className="bg-purple-950/50 text-white border-purple-400 placeholder-purple-300"
                maxLength={500}
                aria-label={`Instructions for ${room.type}`}
              />
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">
            Add rooms to provide instructions.
          </p>
        )}
      </div>
    </div>
  );
};

export default HouseLayoutEditor;
