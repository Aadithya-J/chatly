import { ChatIcon, ServerIcon, SecurityIcon } from "~/components/landing/icons";
import { FeatureCard } from "./feature-card";
export const Features = () => {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="grid gap-12 md:grid-cols-3">
        <FeatureCard
          title="Real-time Chat"
          description="Experience lightning-fast messaging with instant delivery and typing indicators."
          icon={<ChatIcon />}
          bgColor="bg-purple-600/20"
          iconColor="text-purple-400"
        />
        <FeatureCard
          title="Servers"
          description="Create and join servers with like-minded people around shared interests."
          icon={<ServerIcon />}
          bgColor="bg-blue-600/20"
          iconColor="text-blue-400"
        />
        <FeatureCard
          title="Secure & Private"
          description="End-to-end encryption and advanced security features keep your conversations safe."
          icon={<SecurityIcon />}
          bgColor="bg-green-600/20"
          iconColor="text-green-400"
        />
      </div>
    </div>
  );
};
