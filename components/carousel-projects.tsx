"use client";

// import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
// import { Button } from "@/components/ui/button"

// interface Project {
//   id: string
//   name: string
//   location: string
//   description: string
//   status: string
//   image: string
// }

// const projects: Project[] = [
//   {
//     id: "1",
//     name: "TONMAG Heights",
//     location: "Lagos, Nigeria",
//     description: "Luxury residential complex with world-class amenities",
//     status: "Completed",
//     image: "/projects/project-1.jpg",
//   },
//   {
//     id: "2",
//     name: "Smart Living Towers",
//     location: "Abuja, Nigeria",
//     description: "Modern smart home apartments with IoT integration",
//     status: "In Progress",
//     image: "/projects/project-2.jpg",
//   },
//   {
//     id: "3",
//     name: "TONMAG Gardens",
//     location: "Accra, Ghana",
//     description: "Eco-friendly residential community with green spaces",
//     status: "Completed",
//     image: "/projects/project-3.jpg",
//   },
// ]

// export function CarouselProjects() {
//   const [current, setCurrent] = useState(0)

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrent((prev) => (prev + 1) % projects.length)
//     }, 6000)
//     return () => clearInterval(timer)
//   }, [])

//   const next = () => setCurrent((prev) => (prev + 1) % projects.length)
//   const prev = () => setCurrent((prev) => (prev - 1 + projects.length) % projects.length)

//   const project = projects[current]

//   return (
//     <section className="w-full py-20 px-6">
//       <div className="max-w-7xl mx-auto relative">

//         {/* Card */}
//         <div className="relative h-[480px] rounded-3xl overflow-hidden group transition-all duration-700">

//           {/* Image */}
//           <div
//             className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
//             style={{ backgroundImage: `url(${project.image})` }}
//           />

//           {/* Overlay */}
//           <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

//           {/* Content */}
//           <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">

//             <div className="flex items-end justify-between gap-6">
//               <div>
//                 <h3 className="text-3xl md:text-4xl font-semibold leading-tight">
//                   {project.name}
//                 </h3>

//                 <div className="flex items-center gap-2 mt-2 text-sm text-white/90">
//                   <MapPin className="w-4 h-4" />
//                   {project.location}
//                 </div>
//               </div>

//               <Button
//                 variant="ghost"
//                 className="border border-white/40 text-white rounded-full px-7 py-3 hover:bg-white hover:text-black transition"
//               >
//                 View Project →
//               </Button>
//             </div>
//           </div>
//         </div>

//         {/* Navigation */}
//         <button
//           onClick={prev}
//           className="absolute left-[-64px] top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition"
//         >
//           <ChevronLeft />
//         </button>

//         <button
//           onClick={next}
//           className="absolute right-[-64px] top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition"
//         >
//           <ChevronRight />
//         </button>

//         {/* Indicators */}
//         <div className="flex justify-center gap-2 mt-6">
//           {projects.map((_, idx) => (
//             <div
//               key={idx}
//               className={`h-2 rounded-full transition-all duration-300 ${
//                 idx === current ? "w-8 bg-white" : "w-2 bg-white/40"
//               }`}
//             />
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }

// "use client";

// import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Project {
  id: string;
  name: string;
  location: string;
  description: string;
  status: string;
  image: string;
}

const projects: Project[] = [
  {
    id: "1",
    name: "TONMAG Heights",
    location: "Lagos, Nigeria",
    description: "Luxury residential complex with world-class amenities",
    status: "Completed",
    image: "/projects/project-1.jpg",
  },
  {
    id: "2",
    name: "Smart Living Towers",
    location: "Abuja, Nigeria",
    description: "Modern smart home apartments with IoT integration",
    status: "In Progress",
    image: "/projects/project-2.jpg",
  },
  {
    id: "3",
    name: "TONMAG Gardens",
    location: "Accra, Ghana",
    description: "Eco-friendly residential community with green spaces",
    status: "Completed",
    image: "/projects/project-3.jpg",
  },
];

export function ProjectsList() {
  return (
    <section className="w-full py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Grid */}
        {/* md:grid-cols-2 xl:grid-cols-3 */}
        <div className="grid grid-cols-1  gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="relative h-[420px] rounded-3xl overflow-hidden group transition-all duration-500"
            >
              {/* Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${project.image})` }}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="text-2xl font-semibold leading-tight">
                      {project.name}
                    </h3>

                    <div className="flex items-center gap-2 mt-2 text-sm text-white/90">
                      <MapPin className="w-4 h-4" />
                      {project.location}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    className="w-fit border border-white/40 text-white rounded-full px-6 py-2 hover:bg-white hover:text-black transition"
                  >
                    View Project →
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
