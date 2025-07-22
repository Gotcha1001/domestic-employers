// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { toast } from "sonner";

// interface Room {
//   type: string;
//   instructions: string;
//   position?: { x: number; y: number; width: number; height: number };
// }

// interface InstructionTranslatorProps {
//   rooms: Room[];
// }

// interface Language {
//   code: string;
//   name: string;
// }

// export default function InstructionTranslator({
//   rooms,
// }: InstructionTranslatorProps) {
//   const [targetLanguage, setTargetLanguage] = useState<string>("en");
//   const [translatedRooms, setTranslatedRooms] = useState<Room[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [languages, setLanguages] = useState<Language[]>([]);

//   useEffect(() => {
//     const fetchLanguages = async () => {
//       try {
//         const response = await fetch("/api/translate");
//         const supportedLanguages: Language[] = await response.json();
//         setLanguages([
//           { code: "en", name: "English" },
//           ...supportedLanguages,
//           { code: "zu", name: "Zulu (Unsupported)" },
//           { code: "xh", name: "Xhosa (Unsupported)" },
//         ]);
//       } catch (error) {
//         console.error("Error fetching languages:", error);
//         setLanguages([
//           { code: "en", name: "English" },
//           { code: "zu", name: "Zulu (Unsupported)" },
//           { code: "xh", name: "Xhosa (Unsupported)" },
//           { code: "af", name: "Afrikaans" },
//         ]);
//       }
//     };
//     fetchLanguages();
//   }, []);

//   const handleTranslate = async () => {
//     if (!rooms.some((room) => room.instructions.trim() || room.type.trim())) {
//       toast.error("No valid room types or instructions to translate.");
//       return;
//     }

//     if (["zu", "xh"].includes(targetLanguage)) {
//       toast.warning(
//         `${
//           targetLanguage === "zu" ? "Zulu" : "Xhosa"
//         } is not supported. Showing original text.`
//       );
//       setTranslatedRooms(rooms);
//       return;
//     }

//     setLoading(true);
//     try {
//       const translated = await Promise.all(
//         rooms.map(async (room) => {
//           const [translatedType, translatedInstruction] = await Promise.all([
//             room.type && targetLanguage !== "en"
//               ? fetch("/api/translate", {
//                   method: "POST",
//                   headers: { "Content-Type": "application/json" },
//                   body: JSON.stringify({ text: room.type, targetLanguage }),
//                 })
//                   .then((res) => res.json())
//                   .then((data) => data.translatedText)
//               : room.type,
//             room.instructions && targetLanguage !== "en"
//               ? fetch("/api/translate", {
//                   method: "POST",
//                   headers: { "Content-Type": "application/json" },
//                   body: JSON.stringify({
//                     text: room.instructions,
//                     targetLanguage,
//                   }),
//                 })
//                   .then((res) => res.json())
//                   .then((data) => data.translatedText)
//               : room.instructions,
//           ]);
//           return {
//             type: translatedType,
//             instructions: translatedInstruction,
//             position: room.position,
//           };
//         })
//       );
//       setTranslatedRooms(translated);
//       toast.success("Rooms and instructions translated successfully!");
//     } catch (error) {
//       console.error("Translation error:", error);
//       toast.error("Failed to translate. Showing original text.");
//       setTranslatedRooms(rooms);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const displayRooms = translatedRooms.length > 0 ? translatedRooms : rooms;

//   return (
//     <div className="space-y-4 mt-10">
//       <Select onValueChange={setTargetLanguage} defaultValue="en">
//         <SelectTrigger>
//           <SelectValue placeholder="Select language" />
//         </SelectTrigger>
//         <SelectContent>
//           {languages.map((lang) => (
//             <SelectItem key={lang.code} value={lang.code}>
//               {lang.name}
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>
//       <Button onClick={handleTranslate} disabled={loading}>
//         {loading ? "Translating..." : "Translate"}
//       </Button>
//       <div className="space-y-2">
//         <h3 className="text-lg font-semibold">Room Instructions</h3>
//         {displayRooms.length > 0 ? (
//           displayRooms.map((room, index) => (
//             <div key={index} className="my-2">
//               <h4 className="text-md font-semibold">{room.type}</h4>
//               <p className="text-sm">
//                 {room.instructions || "No instructions provided."}
//               </p>
//             </div>
//           ))
//         ) : (
//           <p className="text-sm text-muted-foreground">No rooms added.</p>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Room {
  type: string;
  instructions: string;
  position?: { x: number; y: number; width: number; height: number };
}

interface InstructionTranslatorProps {
  rooms: Room[];
  onLanguageChange?: (language: string, translatedRooms: Room[]) => void; // Updated to pass translated rooms
}

interface Language {
  code: string;
  name: string;
}

export default function InstructionTranslator({
  rooms,
  onLanguageChange,
}: InstructionTranslatorProps) {
  const [targetLanguage, setTargetLanguage] = useState<string>("en");
  const [translatedRooms, setTranslatedRooms] = useState<Room[]>(rooms);
  const [loading, setLoading] = useState<boolean>(false);
  const [languages, setLanguages] = useState<Language[]>([]);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch("/api/translate");
        if (!response.ok) throw new Error("Failed to fetch languages");
        const supportedLanguages: Language[] = await response.json();
        setLanguages([
          { code: "en", name: "English" },
          ...supportedLanguages,
          { code: "zu", name: "Zulu (Unsupported)" },
          { code: "xh", name: "Xhosa (Unsupported)" },
        ]);
      } catch (error) {
        console.error("Error fetching languages:", error);
        setLanguages([
          { code: "en", name: "English" },
          { code: "zu", name: "Zulu (Unsupported)" },
          { code: "xh", name: "Xhosa (Unsupported)" },
          { code: "af", name: "Afrikaans" },
        ]);
      }
    };
    fetchLanguages();
  }, []);

  useEffect(() => {
    setTranslatedRooms(rooms); // Sync with prop changes
  }, [rooms]);

  const handleTranslate = async () => {
    if (!rooms.some((room) => room.instructions.trim() || room.type.trim())) {
      toast.error("No valid room types or instructions to translate.");
      return;
    }

    if (["zu", "xh"].includes(targetLanguage)) {
      toast.warning(
        `${
          targetLanguage === "zu" ? "Zulu" : "Xhosa"
        } is not supported. Showing original text.`
      );
      setTranslatedRooms(rooms);
      if (onLanguageChange) {
        onLanguageChange(targetLanguage, rooms);
      }
      return;
    }

    setLoading(true);
    try {
      const translated = await Promise.all(
        rooms.map(async (room) => {
          const [translatedType, translatedInstruction] = await Promise.all([
            room.type && targetLanguage !== "en"
              ? fetch("/api/translate", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ text: room.type, targetLanguage }),
                })
                  .then((res) => res.json())
                  .then((data) => data.translatedText || room.type)
              : room.type,
            room.instructions && targetLanguage !== "en"
              ? fetch("/api/translate", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    text: room.instructions,
                    targetLanguage,
                  }),
                })
                  .then((res) => res.json())
                  .then((data) => data.translatedText || room.instructions)
              : room.instructions,
          ]);
          return {
            type: translatedType,
            instructions: translatedInstruction,
            position: room.position,
          };
        })
      );
      setTranslatedRooms(translated);
      if (onLanguageChange) {
        onLanguageChange(targetLanguage, translated);
      }
      toast.success("Rooms and instructions translated successfully!");
    } catch (error) {
      console.error("Translation error:", error);
      toast.error("Failed to translate. Showing original text.");
      setTranslatedRooms(rooms);
      if (onLanguageChange) {
        onLanguageChange(targetLanguage, rooms);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (value: string) => {
    setTargetLanguage(value);
  };

  const displayRooms = translatedRooms.length > 0 ? translatedRooms : rooms;

  return (
    <div className="space-y-4 mt-10">
      <Select onValueChange={handleLanguageChange} defaultValue="en">
        <SelectTrigger>
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={handleTranslate} disabled={loading}>
        {loading ? "Translating..." : "Translate"}
      </Button>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Room Instructions</h3>
        {displayRooms.length > 0 ? (
          displayRooms.map((room, index) => (
            <div
              key={index}
              className="my-2 p-4 bg-purple-950/20 rounded-lg shadow-md border border-purple-400 transform transition-all hover:shadow-lg hover:scale-105"
            >
              <h4 className="text-md font-semibold text-purple-100">
                {room.type}
              </h4>
              <p className="text-sm text-gray-300">
                {room.instructions || "No instructions provided."}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No rooms added.</p>
        )}
      </div>
    </div>
  );
}
