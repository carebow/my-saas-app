
import React from "react";

interface StatProps {
  number: string;
  label: string;
  suffix?: string;
}

const StaticStat = ({ number, label, suffix = "" }: StatProps) => {
  return (
    <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl hover:border-purple-200 transition-all duration-300">
      <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
        {number}{suffix}
      </div>
      <div className="text-sm font-medium text-slate-600">{label}</div>
    </div>
  );
};

const StaticStats = () => {
  const stats = [
    { number: "10,000", label: "Families on Waitlist", suffix: "+" },
    { number: "24/7", label: "AI-Powered Support" },
    { number: "98", label: "Satisfaction Rate", suffix: "%" },
    { number: "150", label: "Healthcare Partners", suffix: "+" },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-purple-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Join the growing community of families experiencing better healthcare at home
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StaticStat key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StaticStats;
