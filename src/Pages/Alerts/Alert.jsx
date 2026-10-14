import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, ChevronLeft, ChevronRight, Clock, Camera, CheckCircle, XCircle, TriangleAlert } from "lucide-react";
import { motion } from "framer-motion";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  ALERT_STATUSES,
  DETECTION_CLASSES,
  fetchDetectionAlerts,
  formatAlertDate,
} from "../../utils/detectionAlerts";
import { AiOutlineEye } from "react-icons/ai";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Button,
  Card,
  Tooltip,
  EmptyState,
} from "@heroui/react";

const PAGE_LIMIT = 50;

function Alert() {
  const navigate = useNavigate();
  const today = formatAlertDate(new Date());
  const monthStart = formatAlertDate(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );

  const [start, setStart] = useState(monthStart);
  const [end, setEnd] = useState(today);
  const [status, setStatus] = useState("New");
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [page, setPage] = useState(1);

  const hasValidRange = start <= end;

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["detection-alerts", { start, end, status, selectedClasses, page }],
    queryFn: () =>
      fetchDetectionAlerts({
        start,
        end,
        status,
        classes: selectedClasses,
        page,
        limit: PAGE_LIMIT,
      }),
    enabled: hasValidRange,
    placeholderData: keepPreviousData,
  });

  const alerts = data?.data ?? [];
  const totalAlerts = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const classOptions = data?.classes?.length ? data.classes : DETECTION_CLASSES;
  const rangeStart = alerts.length === 0 ? 0 : (page - 1) * PAGE_LIMIT + 1;
  const rangeEnd = alerts.length === 0 ? 0 : rangeStart + alerts.length - 1;

  const rows = useMemo(
    () =>
      alerts.map((item, index) => ({
        ...item,
        rowNumber: (page - 1) * PAGE_LIMIT + index + 1,
      })),
    [alerts, page],
  );

  const updateFilter = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const toggleClass = (value) => {
    setSelectedClasses((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
    setPage(1);
  };
 

  return (
    <div className="app-canvas flex min-h-screen w-full">
      <div className="flex-1 p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-linear-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent mb-2">
                Alert Management
              </h1>
              <p className="text-slate-500 text-lg">
                Monitor and manage safety alerts in real-time
              </p>
            </div>
          </div>
        </motion.div>

        {/* Recent Alerts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="p-6 shadow-xl bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                Recent Alerts
              </h2>
              <div className="bg-blue-100 px-4 py-2 rounded-full">
                <span className="text-blue-700 font-bold">
                  Total: {totalAlerts.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              <label className="text-sm font-semibold text-slate-700">
                Start date
                <input
                  type="date"
                  value={start}
                  max={end}
                  onChange={(event) => updateFilter(setStart)(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 font-normal outline-none focus:border-blue-500"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                End date
                <input
                  type="date"
                  value={end}
                  min={start}
                  onChange={(event) => updateFilter(setEnd)(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 font-normal outline-none focus:border-blue-500"
                />
              </label>
              
            </div>

            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">Detection class</p>
                {selectedClasses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => updateFilter(setSelectedClasses)([])}
                    className="text-sm font-semibold text-blue-700 hover:text-blue-800"
                  >
                    Clear classes
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {classOptions.map((option) => {
                  const isSelected = selectedClasses.includes(option.class);
                  return (
                    <button
                      key={option.class}
                      type="button"
                      onClick={() => toggleClass(option.class)}
                      className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
                        isSelected
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-blue-50"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
              {!hasValidRange && (
                <p className="mt-3 text-sm font-medium text-red-600">
                  Start date must be on or before the end date.
                </p>
              )}
            </div>

            {/* <div className="overflow-y-auto overflow-x-hidden max-h-100 rounded-xl border border-slate-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-linear-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
                      #
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Camera
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-center px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center gap-4">
                          <Spinner
                            size="lg"
                            color="default"
                            className="text-slate-900"
                          />
                          <p className="text-slate-500 text-lg">Loading...</p>
                        </div>
                      </td>
                    </tr>
                  ) : RecentAlerts.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center gap-4">
                          <AlertTriangle className="w-16 h-16 text-slate-300" />
                          <p className="text-slate-500 text-lg">
                            No alerts found
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    RecentAlerts.map((item, index) => (
                      <tr
                        key={item.id}
                        className="border-b border-slate-100 hover:bg-blue-50 transition-all duration-200 group"
                      >
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-blue-600 text-white text-sm font-bold shadow-md">
                            {index + 1}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-700 font-medium">
                              {new Date(item.time).toLocaleString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <img
                            src={item.image_url}
                            alt={item.event}
                            className="w-24 h-16 object-cover rounded-xl border border-slate-200 shadow-md hover:scale-105 transition-transform duration-200 cursor-pointer"
                            onClick={() =>
                              window.open(item.image_url, "_blank")
                            }
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://placehold.co/120x80/e2e8f0/64748b?text=No+Image";
                            }}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <Camera className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-sm text-slate-700 font-semibold">
                              {item.camera}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                            <span className="text-sm text-slate-700">
                              {item.event}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${
                              item.status === "New"
                                ? "bg-linear-to-r from-red-100 to-red-200 text-red-700"
                                : item.status === "Resolved"
                                  ? "bg-linear-to-r from-green-100 to-emerald-200 text-green-700"
                                  : "bg-linear-to-r from-amber-100 to-yellow-200 text-amber-700"
                            }`}
                          >
                            {item.status === "New" && (
                              <XCircle className="w-3 h-3" />
                            )}
                            {item.status === "Resolved" && (
                              <CheckCircle className="w-3 h-3" />
                            )}
                            {item.status === "In Progress" && (
                              <Clock className="w-3 h-3" />
                            )}
                            {item.status}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Button
                            isIconOnly
                            size="sm"
                            className="bg-linear-to-r  transition-all duration-200 hover:scale-110"
                            onPress={() =>
                              navigate(`/alert/${item.id}`, {
                                state: { alertData: item },
                              })
                            }
                          >
                            <AiOutlineEye className="size-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div> */}
            <Table aria-label="Recent Alerts" removeWrapper>
              <Table.ScrollContainer className="max-h-120 overflow-y-auto overflow-x-hidden">
                <Table.Content aria-label="Team members" className="min-w-150">
                  <Table.Header>
                    <Table.Column className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
                      #
                    </Table.Column>
                    <Table.Column className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
                      TIME
                    </Table.Column>
                    <Table.Column className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
                      IMAGE
                    </Table.Column>
                    <Table.Column className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
                      CAMERA
                    </Table.Column>
                    <Table.Column className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
                      EVENT
                    </Table.Column>
                    <Table.Column className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
                      STATUS
                    </Table.Column>
                    <Table.Column className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
                      ACTION
                    </Table.Column>
                  </Table.Header>
                  {isLoading ? (
                    <Table.Body items={[]}>
                      <Table.Row>
                        <Table.Cell colSpan={7}>
                          <div className="flex flex-col items-center justify-center gap-4 py-10">
                            <Spinner size="lg" />
                            <p>Loading...</p>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  ) : isError ? (
                    <Table.Body items={[]}>
                      <Table.Row>
                        <Table.Cell colSpan={7}>
                          <div className="flex flex-col items-center justify-center gap-3 py-10 text-slate-500">
                            <TriangleAlert className="w-12 h-12 text-orange-500" />
                            <span className="text-sm font-medium">
                              Unable to load alerts
                            </span>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  ) : rows.length === 0 ? (
                    <Table.Body items={[]}>
                      <Table.Row>
                        <Table.Cell colSpan={7}>
                          <div className="flex flex-col items-center justify-center gap-3 py-10 text-slate-500">
                            <TriangleAlert className="w-12 h-12 text-orange-500" />
                            <span className="text-sm font-medium">
                              No alerts found
                            </span>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  ) : (
                    <Table.Body items={rows}>
                      {(item) => (
                        <Table.Row>
                          <Table.Cell>{item.rowNumber}</Table.Cell>
                          <Table.Cell>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-slate-400" />
                              <span className="text-sm">
                                {new Date(item.time).toLocaleString()}
                              </span>
                            </div>
                          </Table.Cell>
                          <Table.Cell>
                            <img
                              src={item.image_url}
                              alt={item.event}
                              className="w-24 h-16 object-cover rounded-xl border border-slate-200 shadow-md hover:scale-105 transition-transform duration-200 cursor-pointer"
                              onClick={() =>
                                window.open(item.image_url, "_blank")
                              }
                              onError={(e) => {
                                e.currentTarget.src =
                                  "https://placehold.co/120x80/e2e8f0/64748b?text=No+Image";
                              }}
                            />
                          </Table.Cell>
                          <Table.Cell>
                            <div className="flex items-center gap-2">
                              <div className="bg-blue-100 p-2 rounded-lg">
                                <Camera className="w-4 h-4 text-blue-600" />
                              </div>
                              <span className="text-sm text-slate-700 font-semibold">
                                {item.camera}
                              </span>
                            </div>
                          </Table.Cell>
                          <Table.Cell>
                            <div className="flex items-center gap-2">
                              <div className="bg-orange-100 p-2 rounded-lg">
                                <AlertTriangle className="w-4 h-4 text-orange-600" />
                              </div>
                              <span className="text-sm text-slate-700 font-semibold">
                                {item.event}
                              </span>
                            </div>
                          </Table.Cell>
                          <Table.Cell>
                            <div
                              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${
                                item.status === "New"
                                  ? "bg-linear-to-r from-red-100 to-red-200 text-red-700"
                                  : item.status === "Resolved"
                                    ? "bg-linear-to-r from-green-100 to-emerald-200 text-green-700"
                                    : "bg-linear-to-r from-amber-100 to-yellow-200 text-amber-700"
                              }`}
                            >
                              {item.status === "New" && (
                                <XCircle className="w-3 h-3" />
                              )}
                              {item.status === "Resolved" && (
                                <CheckCircle className="w-3 h-3" />
                              )}
                              {item.status === "In Progress" && (
                                <Clock className="w-3 h-3" />
                              )}
                              {item.status}
                            </div>
                          </Table.Cell>
                          <Table.Cell>
                            <Tooltip content="View Alert" placement="top">
                              <Button
                                isIconOnly
                                size="sm"
                                className="bg-linear-to-r  transition-all duration-200 hover:scale-110"
                                onPress={() =>
                                  navigate(`/alert/${item.id}`, {
                                    state: { alertData: item },
                                  })
                                }
                              >
                                <AiOutlineEye className="size-4" />
                              </Button>
                            </Tooltip>
                          </Table.Cell>
                        </Table.Row>
                      )}
                    </Table.Body>
                  )}
                </Table.Content>
              </Table.ScrollContainer>
            </Table>

            <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                {isFetching && !isLoading ? "Updating results... " : ""}
                Showing {rangeStart.toLocaleString()}–{rangeEnd.toLocaleString()} of{" "}
                {totalAlerts.toLocaleString()}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page <= 1 || isFetching}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>
                <span className="px-2 text-sm font-semibold text-slate-700">
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  disabled={page >= totalPages || isFetching}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default Alert;
