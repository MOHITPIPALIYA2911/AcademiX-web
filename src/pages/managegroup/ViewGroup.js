import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  mdiHomeOutline,
  mdiCommentQuestionOutline,
  mdiForumOutline,
  mdiAccountMultipleOutline,
  mdiAccountCogOutline,
  mdiContentCopy,
  mdiPencilOutline,
  mdiDeleteOutline,
} from "@mdi/js";
import Icon from "@mdi/react";
import GroupHome from "../../components/group/GroupHome";
import GroupQA from "../../components/group/GroupQA";
import GroupDiscussion from "../../components/group/GroupDiscussion";
import GroupMembers from "../../components/group/GroupMembers";
import axios from "axios";
import { useSelector } from "react-redux";
import { triggerNotification } from "../../utils/toastUtil";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";

const tabs = [
  { key: "dashboard", label: "Group Home", icon: mdiHomeOutline },
  { key: "qa", label: "Q&A", icon: mdiCommentQuestionOutline },
  { key: "discussion", label: "Discussion", icon: mdiForumOutline },
  { key: "members", label: "Members", icon: mdiAccountMultipleOutline },
  { key: "manage", label: "Manage", icon: mdiAccountCogOutline },
];

const GroupLayout = () => {
  const { groupId, frm } = useParams();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [group, setGroup] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({ name: "", description: "" });

  const navigate = useNavigate();
  const user = useSelector((store) => store.user);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const groupRes = await axios.get(`http://localhost:7777/groups/${groupId}`, {
          withCredentials: true,
        });

        const memberRes = await axios.get(
          `http://localhost:7777/groups/${groupId}/members`,
          {
            withCredentials: true,
          }
        );

        const currentMember = memberRes.data.find(
          (m) => m.user_id._id === user._id
        );

        const {
          group_name: name,
          description,
          invitation_code: inviteCode,
        } = groupRes.data;

        setGroup({
          name,
          description,
          inviteCode,
          role: currentMember?.role_in_group || "Member",
        });
      } catch (err) {
        console.error("Failed to load group data", err);
      }
    };

    if (groupId?.length > 0) fetchGroup();
  }, [groupId, user]);

  const copyInviteCode = () => {
    navigator.clipboard.writeText(group?.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEditClick = () => {
    setEditData({
      name: group.name,
      description: group.description,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(
        `http://localhost:7777/groups/${groupId}`,
        {
          groupName: editData.name,
          description: editData.description,
        },
        { withCredentials: true }
      );
      triggerNotification("success", "Group updated successfully");
      setGroup((prev) => ({
        ...prev,
        name: editData.name,
        description: editData.description,
      }));
      setShowEditModal(false);
    } catch (err) {
      console.error("Edit error:", err);
      triggerNotification("error", "Failed to update group");
    }
  };

  const handleLeaveGroup = async () => {
    try {
      await axios.delete(`http://localhost:7777/groups/${groupId}/leave`, {
        withCredentials: true,
      });
      triggerNotification("success", "You left the group");
      navigate("/dashboard");
    } catch (err) {
      console.error("Leave group error:", err);
      triggerNotification("error", "Failed to leave group");
    }
  };


  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:7777/groups/${groupId}`, {
        withCredentials: true,
      });
      triggerNotification("success", "Group deleted successfully");
      navigate("/dashboard");
    } catch (err) {
      console.error("Delete error:", err);
      triggerNotification("error", "Failed to delete group");
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <GroupHome description={group?.description} />;
      case "qa":
        return <GroupQA title={"Q&A"} groupId={groupId} isPublic={false} />;
      case "discussion":
        return <GroupDiscussion />;
      case "members":
        return <GroupMembers groupId={groupId} />;
      case "manage":
        return <p>Manage members, permissions etc.</p>;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 p-0">
      {/* Sidebar */}
      <div className="w-16 bg-white border-r flex flex-col items-center py-4 space-y-6 shadow relative">
        {tabs.map((tab) => {
          if (tab.key === "manage" && group?.role !== "Moderator") return null;
          return (
            <div key={tab.key} className="relative group">
              <button
                onClick={() => setActiveTab(tab.key)}
                className={`text-gray-500 hover:text-green-600 transition ${activeTab === tab.key ? "text-green-600" : ""
                  }`}
              >
                <Icon path={tab.icon} size={1.1} />
              </button>
              <div className="absolute left-12 top-1/2 -translate-y-1/2 bg-white text-xs text-gray-700 px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
                {tab.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main */}
      <div className="flex-1 p-6">


        {frm == "mygrp" ? <Breadcrumb
          paths={[
            { label: "My Groups", path: `/mygroups` },
            { label: "Question" },
          ]}
        /> : frm == "dashboard" ? <Breadcrumb
          paths={[
            { label: "Dashboard", path: "/dashboard" },
            { label: "Question" },
          ]}
        /> : frm == "joinedgrp" ? <Breadcrumb
          paths={[
            { label: "Joined Groups", path: "/joinedgroups" },
            { label: "Question" },
          ]}
        /> : frm == "joingrp" ? <Breadcrumb
          paths={[
            { label: "Join Group", path: "/joingroup" },
            { label: "Question" },
          ]}
        /> : ""}



        {group && (
          <div className="mb-6 flex justify-between items-start flex-wrap gap-4">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-green-700">{group.name}</h2>
              {group.role === "Moderator" && (
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium">Invitation Code:</span>
                  <code className="bg-gray-200 px-2 py-1 rounded text-sm font-mono">
                    {group.inviteCode}
                  </code>
                  <button
                    onClick={copyInviteCode}
                    className="text-green-600 hover:text-green-800"
                  >
                    <Icon path={mdiContentCopy} size={0.85} />
                  </button>
                  {copied && (
                    <span className="text-xs text-green-600">Copied!</span>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              {group.role === "Moderator" ? (
                <>
                  <button
                    onClick={handleEditClick}
                    className="flex items-center gap-2 px-4 py-2 border border-green-600 text-green-700 rounded-md hover:bg-green-50 transition text-sm"
                  >
                    <Icon path={mdiPencilOutline} size={0.85} />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-600 rounded-md hover:bg-red-50 transition text-sm"
                  >
                    <Icon path={mdiDeleteOutline} size={0.85} />
                    Delete
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLeaveGroup}
                  className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-600 rounded-md hover:bg-red-50 transition text-sm"
                >
                  <Icon path={mdiDeleteOutline} size={0.85} />
                  Leave Group
                </button>
              )}
            </div>

          </div>
        )}

        <div className="bg-white rounded shadow min-h-[300px]">
          {renderTabContent()}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-xl font-bold mb-4 text-green-700">Edit Group</h2>
            <label className="block text-sm mb-1">Group Name</label>
            <input
              className="w-full mb-3 px-4 py-2 border rounded"
              value={editData.name}
              onChange={(e) =>
                setEditData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <label className="block text-sm mb-1">Description</label>
            <textarea
              className="w-full mb-4 px-4 py-2 border rounded"
              rows={3}
              value={editData.description}
              onChange={(e) =>
                setEditData((prev) => ({ ...prev, description: e.target.value }))
              }
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={handleEditSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupLayout;
