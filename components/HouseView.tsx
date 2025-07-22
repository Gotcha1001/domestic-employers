// // components/HouseView.tsx
// "use client";

// import { useEffect, useRef } from "react";
// import * as fabric from "fabric";

// interface Room {
//   type: string;
//   instructions: string;
//   position?: { x: number; y: number; width: number; height: number };
// }

// interface HouseViewProps {
//   rooms: Room[];
// }

// declare module "fabric" {
//   interface Group {
//     data?: { type: string; instructions: string };
//   }
// }

// const HouseView: React.FC<HouseViewProps> = ({ rooms }) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     if (!canvasRef.current) return;

//     const canvas = new fabric.Canvas(canvasRef.current, {
//       width: 600,
//       height: 450,
//       backgroundColor: "#e5e7eb",
//       selection: false,
//       interactive: false,
//     });

//     rooms.forEach((room) => {
//       if (room.position) {
//         const fontSize = room.type.length > 10 ? 14 : 16;
//         const rect = new fabric.Rect({
//           left: 0,
//           top: 0,
//           width: room.position.width,
//           height: room.position.height,
//           fill: "rgba(59, 130, 246, 0.6)",
//           stroke: "#1e40af",
//           strokeWidth: 2,
//           rx: 8,
//           ry: 8,
//           selectable: false,
//         });

//         const text = new fabric.Text(room.type, {
//           left: 10,
//           top: 10,
//           fontSize,
//           fill: "#ffffff",
//           fontFamily: "Inter, sans-serif",
//           fontWeight: "600",
//           textAlign: "center",
//           selectable: false,
//         });

//         const group = new fabric.Group([rect, text], {
//           left: room.position.x,
//           top: room.position.y,
//           selectable: false,
//           data: { type: room.type, instructions: room.instructions },
//         });

//         canvas.add(group);
//       }
//     });

//     canvas.renderAll();

//     return () => {
//       canvas.dispose();
//     };
//   }, [rooms]);

//   return (
//     <div className="space-y-6 bg-white/5 p-6 rounded-lg shadow-lg">
//       <h3 className="text-lg font-bold text-purple-200 mb-4">House Layout</h3>
//       <div className="relative flex justify-center">
//         <canvas
//           ref={canvasRef}
//           className="border-2 border-purple-400 rounded-lg shadow-md"
//         />
//       </div>
//       <div>
//         {/* <h3 className="text-lg font-bold text-purple-200 mb-4">
//           Room Instructions
//         </h3>
//         {rooms.length > 0 ? (
//           rooms.map((room, index) => (
//             <div key={index} className="my-4 bg-purple-950/20 p-4 rounded-md">
//               <h4 className="text-md font-semibold text-purple-100">
//                 {room.type}
//               </h4>
//               <p className="text-sm text-gray-300">
//                 {room.instructions || "No instructions provided."}
//               </p>
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-400 text-sm">No rooms added.</p>
//         )} */}
//       </div>
//     </div>
//   );
// };

// export default HouseView;

//RESPONSIVE FOR THE INDIVIDUAL PROFILE
// "use client";

// import { useEffect, useRef, useState } from "react";
// import * as fabric from "fabric";

// interface Room {
//   type: string;
//   instructions: string;
//   position?: { x: number; y: number; width: number; height: number };
// }

// interface HouseViewProps {
//   rooms: Room[];
// }

// // Define a custom interface for our extended Group
// interface ExtendedGroup extends fabric.Group {
//   data?: { type: string; instructions: string };
// }

// const HouseView: React.FC<HouseViewProps> = ({ rooms }) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [canvasDimensions, setCanvasDimensions] = useState({
//     width: 600,
//     height: 450,
//   });

//   // Calculate responsive canvas dimensions
//   const calculateCanvasDimensions = () => {
//     if (!containerRef.current) return { width: 600, height: 450 };

//     const containerWidth = containerRef.current.clientWidth;
//     const maxWidth = Math.min(containerWidth - 32, 600); // 32px for padding
//     const aspectRatio = 4 / 3; // 600:450 ratio
//     const height = maxWidth / aspectRatio;

//     return {
//       width: Math.max(280, maxWidth), // Minimum width for mobile
//       height: Math.max(210, height), // Minimum height for mobile
//     };
//   };

//   // Handle window resize
//   useEffect(() => {
//     const handleResize = () => {
//       const newDimensions = calculateCanvasDimensions();
//       setCanvasDimensions(newDimensions);
//     };

//     handleResize(); // Initial calculation
//     window.addEventListener("resize", handleResize);

//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     if (!canvasRef.current) return;

//     const canvas = new fabric.Canvas(canvasRef.current, {
//       width: canvasDimensions.width,
//       height: canvasDimensions.height,
//       backgroundColor: "#e5e7eb",
//       selection: false,
//       interactive: false,
//     });

//     // Calculate scale factor for responsive room positioning
//     const scaleX = canvasDimensions.width / 600;
//     const scaleY = canvasDimensions.height / 450;

//     rooms.forEach((room) => {
//       if (room.position) {
//         // Scale room dimensions and position
//         const scaledWidth = room.position.width * scaleX;
//         const scaledHeight = room.position.height * scaleY;
//         const scaledX = room.position.x * scaleX;
//         const scaledY = room.position.y * scaleY;

//         // Adjust font size based on canvas size
//         const baseFontSize = room.type.length > 10 ? 14 : 16;
//         const scaledFontSize = Math.max(
//           10,
//           baseFontSize * Math.min(scaleX, scaleY)
//         );

//         const rect = new fabric.Rect({
//           left: 0,
//           top: 0,
//           width: scaledWidth,
//           height: scaledHeight,
//           fill: "rgba(59, 130, 246, 0.6)",
//           stroke: "#1e40af",
//           strokeWidth: Math.max(1, 2 * Math.min(scaleX, scaleY)),
//           rx: Math.max(4, 8 * Math.min(scaleX, scaleY)),
//           ry: Math.max(4, 8 * Math.min(scaleX, scaleY)),
//           selectable: false,
//         });

//         const text = new fabric.Text(room.type, {
//           left: Math.max(5, 10 * scaleX),
//           top: Math.max(5, 10 * scaleY),
//           fontSize: scaledFontSize,
//           fill: "#ffffff",
//           fontFamily: "Inter, sans-serif",
//           fontWeight: "600",
//           textAlign: "center",
//           selectable: false,
//         });

//         const group = new fabric.Group([rect, text], {
//           left: scaledX,
//           top: scaledY,
//           selectable: false,
//         }) as ExtendedGroup;

//         // Add custom data after creation
//         group.data = { type: room.type, instructions: room.instructions };

//         canvas.add(group);
//       }
//     });

//     canvas.renderAll();

//     return () => {
//       canvas.dispose();
//     };
//   }, [rooms, canvasDimensions]);

//   return (
//     <div className="space-y-6 bg-white/5 p-6 rounded-lg shadow-lg">
//       <h3 className="text-lg font-bold text-purple-200 mb-4">House Layout</h3>
//       <div ref={containerRef} className="relative w-full overflow-hidden">
//         <div className="flex justify-center">
//           <canvas
//             ref={canvasRef}
//             className="border-2 border-purple-400 rounded-lg shadow-md max-w-full h-auto"
//             style={{
//               width: canvasDimensions.width,
//               height: canvasDimensions.height,
//             }}
//           />
//         </div>
//       </div>
//       <div>{/* Room instructions section - currently commented out */}</div>
//     </div>
//   );
// };

// export default HouseView;
// components/HouseView.tsx
// import { useEffect, useRef, useState } from "react";
// import * as fabric from "fabric";

// interface Room {
//   type: string;
//   instructions: string;
//   position?: { x: number; y: number; width: number; height: number };
// }

// interface HouseViewProps {
//   rooms: Room[];
//   translatedRooms?: Room[]; // Optional prop for translated rooms
// }

// interface ExtendedGroup extends fabric.Group {
//   data?: { type: string; instructions: string };
// }

// const HouseView: React.FC<HouseViewProps> = ({
//   rooms,
//   translatedRooms = rooms,
// }) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [canvasDimensions, setCanvasDimensions] = useState({
//     width: 600,
//     height: 450,
//   });

//   const calculateCanvasDimensions = () => {
//     if (!containerRef.current) return { width: 600, height: 450 };
//     const containerWidth = containerRef.current.clientWidth;
//     const maxWidth = Math.min(containerWidth - 32, 600);
//     const aspectRatio = 4 / 3;
//     const height = maxWidth / aspectRatio;
//     return {
//       width: Math.max(280, maxWidth),
//       height: Math.max(210, height),
//     };
//   };

//   useEffect(() => {
//     const handleResize = () => {
//       const newDimensions = calculateCanvasDimensions();
//       setCanvasDimensions(newDimensions);
//     };
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     if (!canvasRef.current) return;
//     const canvas = new fabric.Canvas(canvasRef.current, {
//       width: canvasDimensions.width,
//       height: canvasDimensions.height,
//       backgroundColor: "#e5e7eb",
//       selection: false,
//       interactive: false,
//     });

//     const scaleX = canvasDimensions.width / 600;
//     const scaleY = canvasDimensions.height / 450;

//     // Use translatedRooms if available, else fall back to rooms
//     const displayRooms = translatedRooms.length > 0 ? translatedRooms : rooms;

//     displayRooms.forEach((room) => {
//       if (room.position) {
//         const scaledWidth = room.position.width * scaleX;
//         const scaledHeight = room.position.height * scaleY;
//         const scaledX = room.position.x * scaleX;
//         const scaledY = room.position.y * scaleY;
//         const baseFontSize = room.type.length > 10 ? 14 : 16;
//         const scaledFontSize = Math.max(
//           10,
//           baseFontSize * Math.min(scaleX, scaleY)
//         );

//         const rect = new fabric.Rect({
//           left: 0,
//           top: 0,
//           width: scaledWidth,
//           height: scaledHeight,
//           fill: "rgba(59, 130, 246, 0.6)",
//           stroke: "#1e40af",
//           strokeWidth: Math.max(1, 2 * Math.min(scaleX, scaleY)),
//           rx: Math.max(4, 8 * Math.min(scaleX, scaleY)),
//           ry: Math.max(4, 8 * Math.min(scaleX, scaleY)),
//           selectable: false,
//         });

//         const text = new fabric.Text(room.type, {
//           left: Math.max(5, 10 * scaleX),
//           top: Math.max(5, 10 * scaleY),
//           fontSize: scaledFontSize,
//           fill: "#ffffff",
//           fontFamily: "Inter, sans-serif",
//           fontWeight: "600",
//           textAlign: "center",
//           selectable: false,
//         });

//         const group = new fabric.Group([rect, text], {
//           left: scaledX,
//           top: scaledY,
//           selectable: false,
//         }) as ExtendedGroup;

//         group.data = { type: room.type, instructions: room.instructions };
//         canvas.add(group);
//       }
//     });

//     canvas.renderAll();
//     return () => {
//       canvas.dispose();
//     };
//   }, [rooms, translatedRooms, canvasDimensions]);

//   return (
//     <div className="space-y-6 bg-white/5 p-6 rounded-lg shadow-lg">
//       <h3 className="text-lg font-bold text-purple-200 mb-4">House Layout</h3>
//       <div ref={containerRef} className="relative w-full overflow-hidden">
//         <div className="flex justify-center">
//           <canvas
//             ref={canvasRef}
//             className="border-2 border-purple-400 rounded-lg shadow-md max-w-full h-auto"
//             style={{
//               width: canvasDimensions.width,
//               height: canvasDimensions.height,
//             }}
//           />
//         </div>
//       </div>
//       <div>
//         {translatedRooms.map((room, index) => (
//           <div
//             key={`${room.type}-${index}`}
//             className="my-4 p-4 bg-purple-950/20 rounded-lg border-2 border-purple-500 shadow-lg transform transition-all hover:scale-[1.02] hover:shadow-xl"
//             style={{
//               boxShadow:
//                 "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08), inset 0 2px 0 rgba(255, 255, 255, 0.1)",
//             }}
//           >
//             <h4 className="text-md font-semibold text-purple-100">
//               {room.type}
//             </h4>
//             <p className="text-sm text-purple-200">
//               {room.instructions || "No instructions provided."}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default HouseView;

"use client";

import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";

interface Room {
  type: string;
  instructions: string;
  position?: { x: number; y: number; width: number; height: number };
}

interface HouseViewProps {
  rooms: Room[]; // Expect pre-translated rooms
}

interface ExtendedGroup extends fabric.Group {
  data?: { type: string; instructions: string };
}

const HouseView: React.FC<HouseViewProps> = ({ rooms }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: 600,
    height: 450,
  });

  // Calculate responsive canvas dimensions
  const calculateCanvasDimensions = () => {
    if (!containerRef.current) return { width: 600, height: 450 };
    const containerWidth = containerRef.current.clientWidth;
    const maxWidth = Math.min(containerWidth - 32, 600);
    const aspectRatio = 4 / 3;
    const height = maxWidth / aspectRatio;
    return {
      width: Math.max(280, maxWidth),
      height: Math.max(210, height),
    };
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newDimensions = calculateCanvasDimensions();
      setCanvasDimensions(newDimensions);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initialize and update canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: canvasDimensions.width,
      height: canvasDimensions.height,
      backgroundColor: "#e5e7eb",
      selection: false,
      interactive: false,
    });

    const scaleX = canvasDimensions.width / 600;
    const scaleY = canvasDimensions.height / 450;

    rooms.forEach((room) => {
      if (room.position) {
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
          selectable: false,
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
          selectable: false,
        }) as ExtendedGroup;

        group.data = { type: room.type, instructions: room.instructions };
        canvas.add(group);
      }
    });

    canvas.renderAll();

    return () => {
      if (canvas) {
        try {
          canvas.dispose();
        } catch (e) {
          console.error("Error disposing canvas:", e);
        }
      }
    };
  }, [rooms, canvasDimensions]);

  return (
    <div className="space-y-6 bg-white/5 p-6 rounded-lg shadow-lg">
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
          />
        </div>
      </div>
    </div>
  );
};

export default HouseView;
