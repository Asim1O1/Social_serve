import CampaignCard from "../components/CampaignCard";
import CampaignFeatures from "../components/Features";
import HeroSection from "../components/HeroSection";
import Loading from "../components/Loading";
import { useCampaign } from "../context/CampaignContext";

function Home() {
  const fakeCampaigns = [
    {
      id: 1,
      title: "Free Health Checkup Camp",
      description:
        "Get free basic health checkups including BP, sugar, and BMI.",
      location: "Kathmandu",
      date: "2025-01-05",
      image: "https://images.unsplash.com/photo-1580281657521-7f2a4f6f8b9b",
      organizer: "City Hospital",
      volunteersNeeded: 20,
    },
    {
      id: 2,
      title: "Blood Donation Campaign",
      description: "Donate blood and save lives. Open for all healthy adults.",
      location: "Lalitpur",
      date: "2025-01-12",
      image: "https://images.unsplash.com/photo-1582719478185-2f1b7b9b8f6b",
      organizer: "Red Cross Nepal",
      volunteersNeeded: 30,
    },
    {
      id: 3,
      title: "Mental Health Awareness Program",
      description:
        "Awareness session on stress, anxiety, and mental wellbeing.",
      location: "Bhaktapur",
      date: "2025-01-20",
      image: "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb",
      organizer: "MindCare Nepal",
      volunteersNeeded: 15,
    },
  ];

  const { status, activeCampaign, campaigns, choseCampaign, handleRegister } =
    useCampaign();

  return (
    <div>
      <HeroSection />
      <CampaignFeatures />
      <div className="container mx-auto">
        <div>
          <h1 className="text-5xl text-primary font-bold">Latest Campaign</h1>
          <p className="text-lg text-gray-500">
            Explore what's happening around you.
          </p>
        </div>

        {status == "success" && !campaigns && (
          <p className="mt-8">No campaign found.</p>
        )}

        {status == "loading" && (
          <div className="mt-8">
            <Loading />
          </div>
        )}
        {/* Main Content */}
        <div className="grid-container mt-6">
          {fakeCampaigns.map((event) => (
            <CampaignCard
              key={event.id}
              campaign={event}
              choseCampaign={choseCampaign}
              handleRegister={handleRegister}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
