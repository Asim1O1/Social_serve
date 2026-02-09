import { useParams } from "react-router";

export default function VolunteerDetails() {
  const { id } = useParams();
  console.log(id);
}
