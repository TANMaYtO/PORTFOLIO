import HeroScene from "@/components/HeroScene";
import MenuScreen from "@/components/MenuScreen";
import ProjectsScreen from "@/components/ProjectsScreen";
import AboutScreen from "@/components/AboutScreen"; 
import SkillsScreen from "@/components/SkillsScreen";
import ExperienceScreen from "@/components/ExperienceScreen";
import ContactScreen from '@/components/ContactScreen';

export default function Home() {
    return (
        <main className="relative overflow-hidden h-screen w-full bg-[#0a0202]">
            <HeroScene />
            <MenuScreen />
            <ProjectsScreen />
            <AboutScreen /> 
            <SkillsScreen />
            <ExperienceScreen />
            <ContactScreen />
        </main>
    );
}