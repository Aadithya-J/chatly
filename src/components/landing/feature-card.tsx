interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
}

export const FeatureCard = ({
  title,
  description,
  icon,
  bgColor,
  iconColor,
}: FeatureCardProps) => {
  return (
    <div className="rounded-2xl bg-gray-800/50 p-8 transition hover:bg-gray-800/70">
      <div className={`mb-4 rounded-full ${bgColor} w-fit p-3`}>
        <div className={`h-6 w-6 ${iconColor}`}>{icon}</div>
      </div>
      <h3 className="mb-4 text-xl font-bold">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};
