export const displayName = (user) =>
  [user?.firstname, user?.lastname].filter(Boolean).join(" ").trim() ||
  user?.fullname ||
  "";

const normalize = (value) => String(value || "").trim().toLowerCase();

export const isCaseDefendant = (user, item) => {
  if (!user || !item) return false;

  if (item.defendantEmail && user.email) {
    if (normalize(item.defendantEmail) === normalize(user.email)) return true;
  }

  if (item.defendantId && user.userId) {
    if (String(item.defendantId) === String(user.userId)) return true;
  }

  const full = normalize(displayName(user));
  return !!full && full === normalize(item.defendantName);
};

export const isCaseComplainant = (user, item) => {
  if (!user || !item) return false;

  const owner = item.user;
  const ownerId = owner?._id || owner?.userId || (typeof owner === "string" ? owner : null);

  if (ownerId && user.userId && String(ownerId) === String(user.userId)) {
    return true;
  }

  if (owner?.email && user.email && normalize(owner.email) === normalize(user.email)) {
    return true;
  }

  const ownerName = normalize(displayName(owner) || owner?.fullname);
  const selfName = normalize(displayName(user));
  return !!ownerName && !!selfName && ownerName === selfName;
};

export const shouldShowDecisionButtons = (user, item) =>
  item?.status === "Pending" && isCaseDefendant(user, item) && !isCaseComplainant(user, item);
