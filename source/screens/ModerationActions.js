import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showToast } from "../utils/toast";
import { blockUser, otherPartyId, reportUser } from "../utils/moderation";

const REASONS = [
  { label: "Harassment", value: "harassment" },
  { label: "Spam", value: "spam" },
  { label: "Inappropriate", value: "inappropriate" },
];

const readStoredUser = async () => {
  const raw =
    (await AsyncStorage.getItem("userDetails")) ||
    (await AsyncStorage.getItem("userString"));
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const ModerationActions = ({ caseItem, onBlocked }) => {
  const [otherId, setOtherId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [pickingReason, setPickingReason] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const me = await readStoredUser();
      if (active) setOtherId(otherPartyId(me, caseItem));
    };
    load();
    return () => {
      active = false;
    };
  }, [caseItem]);

  if (!otherId) return null;

  const submitReport = async (reason) => {
    try {
      setBusy(true);
      setPickingReason(false);
      await reportUser({
        reportedUserId: otherId,
        reason,
        caseId: caseItem?._id,
        details: caseItem?.description || "",
      });
      showToast("Report submitted");
    } catch (error) {
      showToast(error.message || "Could not submit report");
    } finally {
      setBusy(false);
    }
  };

  const confirmBlock = () => {
    Alert.alert(
      "Block user",
      "You will no longer see cases involving this account.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Block",
          style: "destructive",
          onPress: async () => {
            try {
              setBusy(true);
              await blockUser(otherId);
              showToast("User blocked");
              setBusy(false);
              onBlocked?.(otherId);
            } catch (error) {
              showToast(error.message || "Could not block user");
              setBusy(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.report}
          onPress={() => setPickingReason((open) => !open)}
          disabled={busy}
        >
          <Text style={styles.reportText}>Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.block} onPress={confirmBlock} disabled={busy}>
          <Text style={styles.blockText}>Block</Text>
        </TouchableOpacity>
      </View>
      {pickingReason && (
        <View style={styles.reasons}>
          {REASONS.map((reason) => (
            <TouchableOpacity
              key={reason.value}
              style={styles.reason}
              onPress={() => submitReport(reason.value)}
              disabled={busy}
            >
              <Text style={styles.reasonText}>{reason.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default ModerationActions;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginTop: 8,
  },
  report: {
    marginRight: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#000A83",
  },
  reportText: {
    color: "#000A83",
    fontSize: 12,
    fontWeight: "600",
  },
  block: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#000A83",
  },
  blockText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  reasons: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  reason: {
    marginRight: 8,
    marginBottom: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#EEF0FF",
  },
  reasonText: {
    color: "#000A83",
    fontSize: 12,
    fontWeight: "600",
  },
});
