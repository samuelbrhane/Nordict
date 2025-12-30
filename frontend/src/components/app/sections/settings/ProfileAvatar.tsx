interface ProfileAvatarProps {
  firstName: string;
  lastName: string;
}

const ProfileAvatar = ({ firstName, lastName }: ProfileAvatarProps) => {
  const initials =
    (
      (firstName?.charAt(0) || "") + (lastName?.charAt(0) || "")
    ).toUpperCase() || "?";

  return (
    <div className="relative shrink-0">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-xl text-xl font-bold text-black"
        style={{ backgroundColor: "var(--brand)" }}
      >
        {initials}
      </div>
    </div>
  );
};

export default ProfileAvatar;
