import { useEffect, useState } from "react";
import {
  BellRing,
  Camera,
  CheckCircle2,
  Image,
  Mail,
  MapPin,
  Send,
  Settings2,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "@heroui/react";
import newRequest from "../../utils/userRequest";

function Email() {
  const queryClient = useQueryClient();
  const [recipient, setRecipient] = useState("info@gstsa1.org");
  const [includePhotos, setIncludePhotos] = useState(true);
  const [enabled, setEnabled] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  const getEmailNotifications = async () => {
    const res = await newRequest.get("/email-notifications");
    return res.data?.data ?? res.data;
  };

  const {
    data: emailData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["email-notifications"],
    queryFn: getEmailNotifications,
  });

  useEffect(() => {
    if (!emailData) return;

    if (emailData.receivingEmail != null) {
      setRecipient(emailData.receivingEmail);
    }
    if (emailData.attachCapturedPhotos != null) {
      setIncludePhotos(Boolean(emailData.attachCapturedPhotos));
    }
    if (emailData.enabled != null) {
      setEnabled(Boolean(emailData.enabled));
    }
  }, [emailData]);

  const recentActivity = Array.isArray(emailData?.recentActivity)
    ? emailData.recentActivity.map((item, index) => ({
        id: item.id ?? index + 1,
        event: item.event || "Safety Alert",
        camera: item.camera || "—",
        location: item.location || "—",
        recipient: item.recipient || "—",
        imageUrl: item.image_url || null,
        time: item.createdAt
          ? new Date(item.createdAt).toLocaleString()
          : "—",
        status: item.status || "Delivered",
      }))
    : [];

  const deliveryStatus = emailData?.status ?? {};

  const { mutate: saveSettings, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      const res = await newRequest.put("/email-notifications", {
        receivingEmail: recipient,
        attachCapturedPhotos: includePhotos,
        enabled,
      });
      return res.data;
    },
    onSuccess: () => {
      setSaveError("");
      setIsSaved(true);
      queryClient.invalidateQueries({ queryKey: ["email-notifications"] });
      window.setTimeout(() => setIsSaved(false), 2500);
    },
    onError: (error) => {
      setIsSaved(false);
      setSaveError(
        error?.response?.data?.message ||
          "Failed to save notification settings.",
      );
    },
  });

  const saveNotificationSettings = () => {
    setSaveError("");
    saveSettings();
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-slate-50 to-slate-100 p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            ALERT COMMUNICATIONS
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-800">
            Email Notifications
          </h1>
          <p className="mt-2 text-slate-500">
            Automatically notify your safety team when an event is detected.
          </p>
        </div>
        <button
          onClick={saveNotificationSettings}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSaving ? (
            <Spinner size="sm" color="white" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {isSaving ? "Saving..." : "Save Notifications"}
        </button>
      </div>

      {isSaved && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          <CheckCircle2 className="h-5 w-5" /> Notification settings saved.
        </div>
      )}

      {saveError && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {saveError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="rounded-2xl bg-white p-6 shadow-xl xl:col-span-2">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800">
                Notification Recipient
              </h2>
              <p className="text-sm text-slate-500">
                Choose where safety alerts will be delivered.
              </p>
            </div>
          </div>

          <label className="block text-sm font-semibold text-slate-700">
            Email Address
            <input
              value={recipient}
              onChange={(event) => setRecipient(event.target.value)}
              type="email"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-blue-500"
            />
          </label>

          <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4">
            <input
              checked={includePhotos}
              onChange={(event) => setIncludePhotos(event.target.checked)}
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-slate-300 accent-blue-600"
            />
            <span>
              <span className="flex items-center gap-2 font-semibold text-slate-800">
                <Image className="h-4 w-4 text-blue-600" /> Attach captured
                photos
              </span>
              <span className="mt-1 block text-sm text-slate-500">
                Include detected camera frames with each alert email.
              </span>
            </span>
          </label>

          <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4">
            <input
              checked={enabled}
              onChange={(event) => setEnabled(event.target.checked)}
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-slate-300 accent-blue-600"
            />
            <span>
              <span className="flex items-center gap-2 font-semibold text-slate-800">
                <BellRing className="h-4 w-4 text-blue-600" /> Enable email
                notifications
              </span>
              <span className="mt-1 block text-sm text-slate-500">
                Turn alert emails on or off for this recipient.
              </span>
            </span>
          </label>

          <div className="mt-5 rounded-xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-700">
              Emails include
            </p>
            <div className="mt-3 grid grid-cols-1 gap-3 text-sm text-slate-600 sm:grid-cols-3">
              <span className="flex items-center gap-2">
                <BellRing className="h-4 w-4 text-blue-600" /> Event details
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600" /> Location & time
              </span>
              <span className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-blue-600" /> Camera capture
              </span>
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-slate-900 p-6 text-white shadow-xl">
          <Settings2 className="h-9 w-9 text-blue-400" />
          <h2 className="mt-5 text-xl font-bold">Delivery Status</h2>
          <p className="mt-2 text-sm text-slate-400">
            {(deliveryStatus.notificationsEnabled ?? enabled)
              ? "Safety-alert emails are active and will be sent when a new critical event is detected."
              : "Email notifications are currently disabled."}
          </p>
          <div className="mt-6 rounded-xl bg-slate-800 p-4">
            <p className="text-sm text-slate-400">Current recipient</p>
            <p className="mt-1 break-all text-sm font-bold text-white">
              {deliveryStatus.currentRecipient ||
                recipient ||
                "No recipient selected"}
            </p>
          </div>
          {deliveryStatus.updatedAt && (
            <p className="mt-3 text-xs text-slate-500">
              Updated: {new Date(deliveryStatus.updatedAt).toLocaleString()}
            </p>
          )}
          <p
            className={`mt-5 flex items-center gap-2 text-sm font-semibold ${
              (deliveryStatus.notificationsEnabled ?? enabled)
                ? "text-green-400"
                : "text-slate-400"
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            {(deliveryStatus.notificationsEnabled ?? enabled)
              ? "Notifications enabled"
              : "Notifications disabled"}
          </p>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-xl xl:col-span-3">
          <h2 className="text-xl font-bold text-slate-800">
            Recent Email Activity
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            The latest safety notifications prepared for delivery.
          </p>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner size="lg" color="primary" />
            </div>
          ) : isError ? (
            <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-6 text-center text-sm text-red-600">
              Failed to load email notification history.
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
              No email notifications yet.
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {recentActivity.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col gap-3 rounded-xl border border-slate-100 p-4 sm:flex-row sm:items-center"
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.event}
                      className="h-14 w-14 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="rounded-xl bg-blue-100 p-3">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">{item.event}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {item.location} · {item.camera}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">{item.time}</p>
                  </div>
                  <span className="flex w-fit items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    <CheckCircle2 className="h-3.5 w-3.5" /> {item.status}
                  </span>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Email;
