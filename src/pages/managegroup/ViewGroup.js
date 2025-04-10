import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
import Question from "../../components/group/Question";
import GroupQA from "../../components/group/GroupQA";
import GroupDiscussion from "../../components/group/GroupDiscussion";
import GroupMembers from "../../components/group/GroupMembers";

// import other components here later

const tabs = [
  { key: "dashboard", label: "Group Home", icon: mdiHomeOutline },
  { key: "qa", label: "Q&A", icon: mdiCommentQuestionOutline },
  { key: "discussion", label: "Discussion", icon: mdiForumOutline },
  { key: "members", label: "Members", icon: mdiAccountMultipleOutline },
  { key: "manage", label: "Manage", icon: mdiAccountCogOutline },
];

const GroupLayout = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [group, setGroup] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // TODO: Replace with real API call
    setGroup({
      name: "React Study Group",
      description:
        "This group is for React enthusiasts looking to build real-world projects together, contribute to open source, and explore new patterns and technologies. We welcome beginners and pros alike!",
      inviteCode: "ABC123XYZ",
    });
  }, [id]);

  const copyInviteCode = () => {
    navigator.clipboard.writeText(group?.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <GroupHome description={group?.description} />;
      case "qa":
        return <GroupQA/>  ;
      case "discussion":
        return <GroupDiscussion/>;
      case "members":
        return <GroupMembers/>;
      case "manage":
        return <p>Manage members, permissions etc.</p>;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 p-0">
      {/* Group Sidebar */}
      <div className="w-16 bg-white border-r flex flex-col items-center py-4 space-y-6 shadow relative">
        {tabs.map((tab) => (
          <div key={tab.key} className="relative group">
            <button
              onClick={() => setActiveTab(tab.key)}
              className={`text-gray-500 hover:text-green-600 transition ${
                activeTab === tab.key ? "text-green-600" : ""
              }`}
            >
              <Icon path={tab.icon} size={1.1} />
            </button>
            <div className="absolute left-12 top-1/2 -translate-y-1/2 bg-white text-xs text-gray-700 px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
              {tab.label}
            </div>
          </div>
        ))}
      </div>

      {/* Main Group Content */}
      <div className="flex-1 p-6">
        {group && (
          <div className="mb-6 flex justify-between items-start flex-wrap gap-4">
            {/* Info */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-green-700">{group.name}</h2>
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium">Invitation Code:</span>
                <code className="bg-gray-200 px-2 py-1 rounded text-sm font-mono">{group.inviteCode}</code>
                <button onClick={copyInviteCode} className="text-green-600 hover:text-green-800">
                  <Icon path={mdiContentCopy} size={0.85} />
                </button>
                {copied && <span className="text-xs text-green-600">Copied!</span>}
              </div>
            </div>

            {/* Edit/Delete */}
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-green-600 text-green-700 rounded-md hover:bg-green-50 transition text-sm">
                <Icon path={mdiPencilOutline} size={0.85} />
                Edit
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-600 rounded-md hover:bg-red-50 transition text-sm">
                <Icon path={mdiDeleteOutline} size={0.85} />
                Delete
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded shadow  min-h-[300px]">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default GroupLayout;
