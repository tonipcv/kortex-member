/* eslint-disable */
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, UserCircleIcon, NewspaperIcon, RssIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export default function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [userProfile, setUserProfile] = useState<{ avatarUrl?: string | null }>({});

  // Buscar o perfil do usuário
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch(`/api/profile?email=${session.user.email}`);
          const data = await response.json();
          setUserProfile(data);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchUserProfile();
  }, [session?.user?.email]);

  // Não mostrar navegação em páginas de autenticação
  if (pathname?.startsWith('/auth')) {
    return null;
  }

  const navSections: NavSection[] = [
    {
      title: "Principal",
      items: [
        {
          href: '/courses',
          label: 'Cursos',
          icon: BookOpen,
          description: 'Explore nossos cursos'
        },
        {
          href: '/blog',
          label: 'Blog',
          icon: NewspaperIcon,
          description: 'Artigos e novidades'
        },
        {
          href: '/feed',
          label: 'Feed',
          icon: RssIcon,
          description: 'Compartilhe experiências'
        }
      ]
    }
  ];

  const NavButton = ({ item, className }: { item: typeof navSections[0]['items'][0], className?: string }) => (
    <Button
      variant="outline"
      className={cn(
        "w-full h-14 flex items-center justify-center bg-transparent",
        pathname === item.href 
          ? "border-white/20 text-white hover:bg-white/5" 
          : "border-white/10 text-white/70 hover:border-white/20 hover:text-white hover:bg-white/5",
        className
      )}
    >
      <item.icon className="h-4 w-4 stroke-current" />
    </Button>
  );

  const ProfileButton = () => (
    <div className="w-full h-14 flex items-center justify-center cursor-pointer border border-white/10 rounded-md hover:border-white/20">
      {userProfile.avatarUrl ? (
        <Avatar className="h-8 w-8">
          <AvatarImage src={userProfile.avatarUrl} alt={session?.user?.name || "Profile"} />
          <AvatarFallback>
            {session?.user?.name?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
      ) : (
        <UserCircleIcon className="h-4 w-4 text-white" />
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Navigation */}
      <div className="fixed top-0 left-0 bottom-0 hidden lg:flex flex-col w-20 border-r border-white/10 bg-transparent backdrop-blur supports-[backdrop-filter]:bg-background/10">
        <div className="p-6 border-b border-white/10">
          <Link href="/feed" className="flex items-center justify-center">
            <span className="text-sm font-normal text-white tracking-wide">KORAX</span>
          </Link>
        </div>
        <div className="flex-1 py-6">
          <nav className="space-y-6 px-2">
            {navSections.map((section) => (
              <div key={section.title} className="space-y-1">
                {section.items.map((item) => (
                  <Link key={item.href} href={item.href} className="block">
                    <NavButton item={item} />
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        </div>
        <div className="p-6 border-t border-white/10">
          <Link href="/profile">
            <ProfileButton />
          </Link>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <div className="fixed top-0 left-0 right-0 h-[4.5rem] border-b border-white/10 bg-transparent backdrop-blur supports-[backdrop-filter]:bg-background/10 z-40">
          <div className="py-4 px-4 flex justify-between items-center">
            <Link href="/feed" className="flex items-center">
              <span className="text-sm font-normal text-white tracking-wide">KORAX</span>
            </Link>
            <Link href="/profile">
              <div className="h-8 w-8 flex items-center justify-center cursor-pointer">
                {userProfile.avatarUrl ? (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userProfile.avatarUrl} alt={session?.user?.name || "Profile"} />
                    <AvatarFallback>
                      {session?.user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <UserCircleIcon className="h-4 w-4 text-white" />
                )}
              </div>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <nav className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-transparent backdrop-blur supports-[backdrop-filter]:bg-background/10 z-40">
          <div className="py-3 px-4">
            <div className="flex items-center justify-around gap-2">
              {navSections.flatMap(section => section.items).map((item) => (
                <Link key={item.href} href={item.href} className="flex-1">
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-14 flex items-center justify-center bg-transparent",
                      pathname === item.href 
                        ? "border-white/20 text-white hover:bg-white/5" 
                        : "border-white/10 text-white/70 hover:border-white/20 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <item.icon className="h-4 w-4 stroke-current" />
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
} 