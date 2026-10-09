import AsyncStorage from "@react-native-async-storage/async-storage";
import baseUrl from "../../assets/baseUrl";

const BLOCKED_KEY = "blockedUserIds";

const ownerIdOf = (item) => {
  const owner = item?.user;
  return owner?._id || owner?.userId || (typeof owner === "string" ? owner : null);
};

const readJson = async (response) => {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
};

const authHeaders = async () => {
  const token = await AsyncStorage.getItem("token");
  if (!token) {
    throw new Error("Please log in again");
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const otherPartyId = (me, item) => {
  if (!item) return null;
  const mine = String(me?.userId || me?._id || "");
  const ownerId = ownerIdOf(item);
  const defendantId = item.defendantId || null;

  if (mine && ownerId && String(ownerId) === mine) {
    return defendantId ? String(defendantId) : null;
  }
  if (ownerId && String(ownerId) !== mine) return String(ownerId);
  if (defendantId && String(defendantId) !== mine) return String(defendantId);
  return null;
};

export const caseInvolvesUser = (item, userId) => {
  const id = String(userId || "");
  if (!id) return false;
  return String(ownerIdOf(item) || "") === id || String(item?.defendantId || "") === id;
};

export const loadBlockedIds = async () => {
  const raw = await AsyncStorage.getItem(BLOCKED_KEY);
  if (!raw) return new Set();
  try {
    return new Set(JSON.parse(raw));
  } catch {
    return new Set();
  }
};

const saveBlockedIds = async (ids) => {
  await AsyncStorage.setItem(BLOCKED_KEY, JSON.stringify([...ids]));
};

export const rememberBlock = async (userId) => {
  const ids = await loadBlockedIds();
  ids.add(String(userId));
  await saveBlockedIds(ids);
};

export const forgetBlock = async (userId) => {
  const ids = await loadBlockedIds();
  ids.delete(String(userId));
  await saveBlockedIds(ids);
};

const isCaseBlocked = (item, blocked, me) => {
  const mine = String(me?.userId || me?._id || "");
  const ids = [ownerIdOf(item), item?.defendantId].filter(Boolean).map(String);
  return ids.some((id) => id !== mine && blocked.has(id));
};

export const withoutBlockedCases = async (cases) => {
  const blocked = await loadBlockedIds();
  if (!blocked.size) return cases || [];
  const raw =
    (await AsyncStorage.getItem("userDetails")) ||
    (await AsyncStorage.getItem("userString"));
  const me = raw ? JSON.parse(raw) : null;
  return (cases || []).filter((item) => !isCaseBlocked(item, blocked, me));
};

const request = async (path, options) => {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: await authHeaders(),
  });
  const data = await readJson(response);
  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Request failed");
  }
  return data;
};

export const reportUser = ({ reportedUserId, reason, caseId, details }) =>
  request("reports", {
    method: "POST",
    body: JSON.stringify({
      reportedUserId,
      reason,
      caseId,
      details: details || "",
    }),
  });

export const blockUser = async (userId) => {
  const data = await request("blocks", {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
  await rememberBlock(userId);
  return data;
};

export const unblockUser = async (userId) => {
  const data = await request(`blocks/${userId}`, { method: "DELETE" });
  await forgetBlock(userId);
  return data;
};

export const deleteMyAccount = () => request("users/me", { method: "DELETE" });
