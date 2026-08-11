import Hero from "@/components/sections/Hero";
import Thesis from "@/components/sections/Thesis";
import ProjectCase from "@/components/sections/ProjectCase";
import Practice from "@/components/sections/Practice";
import Contact from "@/components/sections/Contact";
import { projects } from "@/lib/content";

export default function Page() {
  return (
    <>
      <Hero />
      <Thesis />
      {projects.map((p) => (
        <ProjectCase key={p.id} project={p} />
      ))}
      <Practice />
      <Contact />
    </>
  );
}
