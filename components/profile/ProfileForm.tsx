import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileSchema } from "@/validators/updateProfileSchema.validation";
import { UpdateProfileRequest } from "@/types/updateProfile.type";
import { CustomInput } from "@/components/ui/custom-input";
import { Button } from "@/components/ui/button";
import { User, Mail, Image, Save, Loader2 } from "lucide-react";
import { showSuccess, showError } from "@/lib/toast";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "@/redux/features/auth/authSlice";
import { AppDispatch } from "@/redux/store";

interface ProfileFormProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
  };
}

export const ProfileForm = ({ user }: ProfileFormProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileRequest>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  });

  const onSubmit = async (data: UpdateProfileRequest) => {
    try {
      const result = await dispatch(updateUserProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        oldAvatarPath: user.avatar || undefined,
        avatar: data.avatar,
      })).unwrap();
      showSuccess("Profile Updated", result.message || "Your profile details have been saved successfully.");
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = typeof err === 'string' ? err : (err instanceof Error ? err.message : "Failed to update profile.");
      showError("Update failed", errorMessage);
    }
  };

  const getInitials = () => {
    const f = user.firstName?.[0] || "";
    const l = user.lastName?.[0] || "";
    return (f + l).toUpperCase() || "U";
  };

  return (
    <div className="flex-1 bg-card border border-border/60 rounded-xl p-6 shadow-xs flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Profile Details</h2>
        <p className="text-sm text-muted-foreground">Manage your personal settings and avatar image.</p>
      </div>

      {/* Avatar Preview Header */}
      <div className="flex items-center gap-4 bg-muted/40 p-4 rounded-xl border border-border/40">
        <div className="w-16 h-16 rounded-full overflow-hidden border border-border/60 bg-muted flex items-center justify-center shrink-0">
          {user.avatar ? (
            <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xl font-bold text-brand">{getInitials()}</span>
          )}
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">{user.firstName} {user.lastName}</span>
          <span className="text-xs text-muted-foreground">{user.email}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CustomInput
            id="profile-firstname"
            label="First Name"
            icon={User}
            placeholder="John"
            error={errors.firstName}
            {...register("firstName")}
          />
          <CustomInput
            id="profile-lastname"
            label="Last Name"
            icon={User}
            placeholder="Doe"
            error={errors.lastName}
            {...register("lastName")}
          />
        </div>

        <CustomInput
          id="profile-email"
          label="Email Address"
          icon={Mail}
          placeholder="john.doe@example.com"
          type="email"
          error={errors.email}
          {...register("email")}
        />

        <CustomInput
          id="profile-avatar"
          label="Profile Avatar Image"
          icon={Image}
          type="file"
          accept="image/*"
          error={errors.avatar}
          className="file:text-brand file:font-semibold file:cursor-pointer hover:file:text-brand-hover cursor-pointer"
          {...register("avatar")}
        />

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg py-2.5 px-6 font-semibold flex items-center gap-2 cursor-pointer bg-brand hover:bg-brand-hover text-white"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
