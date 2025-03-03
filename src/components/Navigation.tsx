/* eslint-disable */
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CreditCard, LineChart, Building2, Receipt, FileText, BarChart } from 'lucide-react';
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

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Bancos', href: '/banks', icon: Building2 },
  { name: 'Cartões', href: '/cards', icon: CreditCard },
  { name: 'Lançamentos', href: '/transactions', icon: Receipt },
  { name: 'Relatórios', href: '/reports', icon: BarChart },
];

// Componente do Logo com três traços horizontais, meio mais longo
const Logo = () => (
  <div className="flex flex-col gap-1.5">
    <div className="h-0.5 w-6 bg-gray-900"></div>
    <div className="h-0.5 w-8 bg-gray-900"></div>
    <div className="h-0.5 w-6 bg-gray-900"></div>
  </div>
);

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
          href: '/dashboard',
          label: 'Dashboard',
          icon: LayoutDashboard,
          description: 'Overview'
        },
        {
          href: '/cards',
          label: 'Cartões',
          icon: CreditCard,
          description: 'Manage cards'
        },
        {
          href: '/banks',
          label: 'Contas',
          icon: Building2,
          description: 'Bank accounts'
        },
        {
          href: '/transactions',
          label: 'Lançamentos',
          icon: Receipt,
          description: 'Expenses and income'
        },
        {
          href: '/reports',
          label: 'Relatórios',
          icon: FileText,
          description: 'Financial reports'
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
          ? "border-gray-900 text-gray-900 hover:bg-gray-50" 
          : "border-gray-200 text-gray-600 hover:border-gray-900 hover:text-gray-900 hover:bg-gray-50",
        className
      )}
    >
      <item.icon className="h-4 w-4 stroke-current" />
    </Button>
  );

  const ProfileButton = () => (
    <div className="w-full h-14 flex items-center justify-center cursor-pointer border border-gray-200 rounded-md hover:border-gray-900 hover:text-gray-900">
      {userProfile.avatarUrl ? (
        <Avatar className="h-8 w-8">
          <AvatarImage src={userProfile.avatarUrl} alt={session?.user?.name || "Profile"} />
          <AvatarFallback>
            {session?.user?.name?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
      ) : (
        <LayoutDashboard className="h-4 w-4 text-gray-900" />
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Navigation */}
      <div className="fixed top-0 left-0 bottom-0 hidden lg:flex flex-col w-20 border-r border-gray-200 bg-white">
        <div className="p-6 border-b border-gray-200">
          <Link href="/dashboard" className="flex flex-col items-center justify-center">
            <Logo />
            <span className="text-[10px] font-medium text-gray-900 tracking-wide mt-2">FINANCY·AI</span>
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
        <div className="p-6 border-t border-gray-200">
          <Link href="/profile">
            <ProfileButton />
          </Link>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <div className="fixed top-0 left-0 right-0 h-[4.5rem] border-b border-gray-200 bg-white z-40">
          <div className="py-4 px-4 flex justify-between items-center">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Logo />
              <span className="text-xs font-medium text-gray-900 tracking-wide">FINANCY·AI</span>
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
                  <LayoutDashboard className="h-4 w-4 text-gray-900" />
                )}
              </div>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white z-40">
          <div className="py-3 px-4">
            <div className="flex items-center justify-around gap-2">
              {navSections.flatMap(section => section.items).map((item) => (
                <Link key={item.href} href={item.href} className="flex-1">
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-14 flex items-center justify-center bg-transparent",
                      pathname === item.href 
                        ? "border-gray-900 text-gray-900 hover:bg-gray-50" 
                        : "border-gray-200 text-gray-600 hover:border-gray-900 hover:text-gray-900 hover:bg-gray-50"
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