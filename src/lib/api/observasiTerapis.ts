import axiosInstance from "../axios";

export async function getScheduledObservations() {
  const res = await axiosInstance.get("/observations?status=scheduled");
  return res.data;
}

export async function getScheduledObservationDetail(observation_id: string) {
  const res = await axiosInstance.get(`/observations/${observation_id}?type=scheduled`);
  return res.data.data;
}

export async function getCompletedObservations() {
  const res = await axiosInstance.get("/observations/completed");
  return res.data;
}

export async function getCompletedObservationDetail(observation_id: string) {
  const res = await axiosInstance.get(`/observations/completed/${observation_id}`);
  return res.data.data;
}

export async function getCompletedObservationSummary(observation_id: string) {
  const res = await axiosInstance.get(`/observations/completed/${observation_id}/summary`);
  return res.data;
}

export async function getObservationAnswers(observation_id: string) {
  const res = await axiosInstance.get(`/observations/answer/${observation_id}`);
  return res.data.data;
}

export async function updateObservationAgreement(
  id: string,
  agreementStatus: "approved" | "rejected"
) {
  const res = await axiosInstance.patch(
    `/observations/${id}/assessment-agreement`,
    { agreement_status: agreementStatus }
  );
  return res.data;
}
