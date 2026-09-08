import {
  FileText,
  XCircle,
  UserRound,
  Phone,
  MapPin,
  Hospital,
  Activity,
  CheckCircle2,
} from "lucide-react";

const HOME_CARE = "home-care";
const HOSPITAL_CARE = "hospital";

const workflowSteps = [
  "Requested",
  "Under Review",
  "Approved",
  "Assigned",
  "Active",
  "Completed",
];

const ServiceRequestDetails = ({
  request,
  onClose,
  onUpdateStatus,
  onOpenAssign,
  serviceEligibility,
  StatusBadge,
  PriorityBadge,
  ServiceTypeBadge,
}) => {
  if (!request) return null;

  const serviceConfig = serviceEligibility[request.service];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#073F42]/50 p-3 backdrop-blur-sm sm:p-5">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-[#E2EFED] px-4 py-4 sm:px-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E8F8F6]">
                <FileText className="h-4 w-4 text-[#08A6A0]" />
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-sm font-bold text-[#173F41] sm:text-base">
                  Service Request Details
                </h2>
                <p className="text-[10px] text-[#789092] sm:text-xs">
                  {request.id}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#789092] hover:bg-[#F1F7F6] hover:text-[#173F41]"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="max-h-[calc(92vh-145px)] overflow-y-auto p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[#E2EFED] bg-[#FBFEFD] p-3">
              <p className="text-[9px] font-semibold uppercase tracking-wide text-[#789092]">
                Patient
              </p>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8F8F6]">
                  <UserRound className="h-4 w-4 text-[#08A6A0]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#173F41]">
                    {request.patientName}
                  </p>
                  <p className="text-[10px] text-[#789092]">
                    {request.patientId}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#E2EFED] bg-[#FBFEFD] p-3">
              <p className="text-[9px] font-semibold uppercase tracking-wide text-[#789092]">
                Requested Service
              </p>
              <p className="mt-2 text-sm font-bold text-[#173F41]">
                {request.service}
              </p>
              <div className="mt-1">
                <ServiceTypeBadge service={request.service} />
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div className="rounded-lg bg-[#F8FCFB] p-2.5">
              <p className="text-[9px] text-[#789092]">Priority</p>
              <div className="mt-1">
                <PriorityBadge priority={request.priority} />
              </div>
            </div>
            <div className="rounded-lg bg-[#F8FCFB] p-2.5">
              <p className="text-[9px] text-[#789092]">Duration</p>
              <p className="mt-1 text-[10px] font-semibold text-[#173F41]">
                {request.duration}
              </p>
            </div>
            <div className="rounded-lg bg-[#F8FCFB] p-2.5">
              <p className="text-[9px] text-[#789092]">Start Date</p>
              <p className="mt-1 text-[10px] font-semibold text-[#173F41]">
                {request.startDate}
              </p>
            </div>
            <div className="rounded-lg bg-[#F8FCFB] p-2.5">
              <p className="text-[9px] text-[#789092]">Status</p>
              <div className="mt-1">
                <StatusBadge status={request.status} />
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-[#E2EFED] p-3">
            <p className="text-[9px] font-semibold uppercase tracking-wide text-[#789092]">
              Contact & Location
            </p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#08A6A0]" />
                <span className="text-xs text-[#173F41]">
                  {request.contact}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#08A6A0]" />
                <span className="text-xs text-[#173F41]">
                  {request.location}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-[#E2EFED] p-3">
            <p className="text-[9px] font-semibold uppercase tracking-wide text-[#789092]">
              Schedule
            </p>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              <div>
                <p className="text-[9px] text-[#789092]">Start</p>
                <p className="mt-0.5 text-xs font-semibold text-[#173F41]">
                  {request.startDate}
                </p>
              </div>
              <div>
                <p className="text-[9px] text-[#789092]">End</p>
                <p className="mt-0.5 text-xs font-semibold text-[#173F41]">
                  {request.endDate}
                </p>
              </div>
              <div>
                <p className="text-[9px] text-[#789092]">Time</p>
                <p className="mt-0.5 text-xs font-semibold text-[#173F41]">
                  {request.time}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-[#E2EFED] p-3">
            <p className="text-[9px] font-semibold uppercase tracking-wide text-[#789092]">
              Patient Requirement / Notes
            </p>
            <p className="mt-2 text-xs leading-5 text-[#4F6668]">
              {request.notes}
            </p>
          </div>

          {serviceConfig?.type === HOSPITAL_CARE && (
            <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 p-3">
              <div className="flex items-start gap-2">
                <Hospital className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                <div>
                  <p className="text-xs font-semibold text-blue-800">
                    Hospital Nursing Workflow
                  </p>
                  <p className="mt-1 text-[10px] leading-4 text-blue-700">
                    This patient is receiving care inside the hospital. GNM,
                    ANM, B.Sc and ICU nurses are hospital staff and are not
                    assigned as home-care caregivers from this service request
                    page. Nursing allocation should be handled through the
                    appropriate ward, ICU or hospital staffing workflow.
                  </p>
                </div>
              </div>
            </div>
          )}

          {serviceConfig?.type === HOME_CARE && (
            <div className="mt-3 rounded-xl border border-[#E2EFED] p-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-wide text-[#789092]">
                    Home-Care Assignment
                  </p>
                  {request.assignedTo ? (
                    <p className="mt-1 text-xs font-semibold text-[#173F41]">
                      Assigned to {request.assignedTo}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-[#789092]">
                      No home-care staff assigned
                    </p>
                  )}
                </div>
                {["Approved", "Assigned", "Active"].includes(
                  request.status
                ) && (
                  <button
                    type="button"
                    onClick={() => onOpenAssign(request)}
                    className="rounded-lg bg-[#08A6A0] px-3 py-2 text-[10px] font-semibold text-white transition hover:bg-[#078F8A]"
                  >
                    {request.assignedTo ? "Reassign" : "Assign Staff"}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Workflow */}
          <div className="mt-4">
            <div className="mb-2 flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#08A6A0]" />
              <h3 className="text-xs font-bold text-[#173F41]">
                Request Workflow
              </h3>
            </div>
            <div className="overflow-x-auto pb-2">
              <div className="flex min-w-[620px] items-start">
                {workflowSteps.map((step, index) => {
                  const currentIndex = workflowSteps.indexOf(request.status);
                  const completed =
                    currentIndex >= index && currentIndex !== -1;
                  return (
                    <div key={step} className="flex flex-1 items-start">
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex h-7 w-7 items-center justify-center rounded-full ${
                            completed
                              ? "bg-[#08A6A0] text-white"
                              : "bg-[#EAF2F1] text-[#789092]"
                          }`}
                        >
                          {completed ? (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          ) : (
                            <span className="text-[9px] font-bold">
                              {index + 1}
                            </span>
                          )}
                        </div>
                        <p
                          className={`mt-1 text-center text-[9px] ${
                            completed
                              ? "font-semibold text-[#173F41]"
                              : "text-[#789092]"
                          }`}
                        >
                          {step}
                        </p>
                      </div>
                      {index < workflowSteps.length - 1 && (
                        <div
                          className={`mt-3 h-0.5 flex-1 ${
                            currentIndex > index
                              ? "bg-[#08A6A0]"
                              : "bg-[#E2EFED]"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E2EFED] bg-[#FBFEFD] px-4 py-3 sm:px-5">
          <div className="flex flex-wrap gap-2">
            {["Requested", "Under Review"].includes(request.status) && (
              <>
                <button
                  type="button"
                  onClick={() => onUpdateStatus(request.id, "Approved")}
                  className="rounded-lg bg-[#08A6A0] px-3 py-2 text-[10px] font-semibold text-white hover:bg-[#078F8A]"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateStatus(request.id, "Rejected")}
                  className="rounded-lg border border-red-200 px-3 py-2 text-[10px] font-semibold text-red-600 hover:bg-red-50"
                >
                  Reject
                </button>
              </>
            )}

            {request.status === "Approved" &&
              serviceConfig?.type === HOME_CARE && (
                <button
                  type="button"
                  onClick={() => onOpenAssign(request)}
                  className="rounded-lg bg-[#173F41] px-3 py-2 text-[10px] font-semibold text-white hover:bg-[#214C4E]"
                >
                  Assign Staff
                </button>
              )}

            {request.status === "Assigned" && (
              <button
                type="button"
                onClick={() => onUpdateStatus(request.id, "Active")}
                className="rounded-lg bg-[#08A6A0] px-3 py-2 text-[10px] font-semibold text-white hover:bg-[#078F8A]"
              >
                Start Service
              </button>
            )}

            {request.status === "Active" && (
              <button
                type="button"
                onClick={() => onUpdateStatus(request.id, "Completed")}
                className="rounded-lg bg-green-600 px-3 py-2 text-[10px] font-semibold text-white hover:bg-green-700"
              >
                Mark Completed
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#DCEBE9] px-3 py-2 text-[10px] font-semibold text-[#173F41] hover:bg-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequestDetails;