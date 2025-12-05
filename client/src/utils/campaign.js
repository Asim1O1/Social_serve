//register volunteer to campaign
export const handleRegister = async (user) => {
  if (!user) {
    navigate("/login");
    return;
  }
  await registerEventVolunteer(user.id);
};
