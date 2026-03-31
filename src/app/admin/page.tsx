import Link from "next/link";
import {
  Settings,
  Image,
  Wrench,
  Images,
  Tag,
  MessageSquare,
  FileText,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const sections = [
  {
    href: "/admin/settings",
    title: "Settings",
    description: "Manage site settings and configuration",
    icon: Settings,
  },
  {
    href: "/admin/slider",
    title: "Slider",
    description: "Manage homepage slider images",
    icon: Image,
  },
  {
    href: "/admin/services",
    title: "Services",
    description: "Add and edit service offerings",
    icon: Wrench,
  },
  {
    href: "/admin/gallery",
    title: "Gallery",
    description: "Manage project gallery photos",
    icon: Images,
  },
  {
    href: "/admin/promotions",
    title: "Promotions",
    description: "Create and manage promotions",
    icon: Tag,
  },
  {
    href: "/admin/testimonials",
    title: "Testimonials",
    description: "Manage customer testimonials",
    icon: MessageSquare,
  },
  {
    href: "/admin/content",
    title: "Content",
    description: "Edit site content and pages",
    icon: FileText,
  },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">
        Welcome to GDL Stone Snow Admin
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.href} href={section.href}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-[#8BB63A]/10">
                    <Icon className="h-5 w-5 text-[#8BB63A]" />
                  </div>
                  <CardTitle className="text-base">{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
