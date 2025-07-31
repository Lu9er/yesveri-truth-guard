import { TrendingUp, Users, Globe, Shield } from "lucide-react";

const stats = [
  {
    icon: TrendingUp,
    value: "99.7%",
    label: "Accuracy Rate",
    description: "Verified across millions of content pieces"
  },
  {
    icon: Users,
    value: "50K+",
    label: "Active Users",
    description: "Trust Yesveri for content verification"
  },
  {
    icon: Globe,
    value: "4",
    label: "Languages",
    description: "Including major Nigerian languages"
  },
  {
    icon: Shield,
    value: "1M+",
    label: "Verifications",
    description: "Completed with blockchain proof"
  }
];

export const StatsSection = () => {
  return (
    <section className="py-16 bg-secondary text-secondary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className="text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex w-12 h-12 items-center justify-center rounded-lg bg-white/10 mb-4">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              <div className="text-lg font-semibold mb-1">{stat.label}</div>
              <div className="text-sm opacity-80">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};