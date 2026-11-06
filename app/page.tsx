import { getPortfolioData } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

// Revalidate every 60 seconds, or instantly on-demand when edited in /admin via revalidatePath
export const revalidate = 60;

export default async function Home() {
  const data = await getPortfolioData();

  return (
    <>
      <Navbar profile={data.profile} navLinks={data.navLinks} />
      <main>
        <Hero profile={data.profile} />
        <About
          about={data.about}
          education={data.education}
          certifications={data.certifications}
          sectionHeaders={data.sectionHeaders}
        />
        <Projects projects={data.projects} sectionHeaders={data.sectionHeaders} />
        <Experience experience={data.experience} sectionHeaders={data.sectionHeaders} />
        <Skills skillGroups={data.skillGroups} sectionHeaders={data.sectionHeaders} />
        <Contact profile={data.profile} sectionHeaders={data.sectionHeaders} />
      </main>
      <Footer profile={data.profile} />
    </>
  );
}
