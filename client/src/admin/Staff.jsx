export default function Staff() {
  const staffMembers = [
    {
      name: "Admin User",
      email: "admin@samadhiarana.com",
      role: "Super Admin",
    },
    {
      name: "Temple Staff",
      email: "staff@samadhiarana.com",
      role: "Staff",
    },
  ];

  const handleAddStaff = () => {
    alert("Add Staff functionality will be connected later.");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Staff Management
        </h1>

        <button
          onClick={handleAddStaff}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-xl"
        >
          Add Staff
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-orange-500 text-white">
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Role</th>
            </tr>
          </thead>

          <tbody>
            {staffMembers.map((staff, index) => (
              <tr
                key={index}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-4">{staff.name}</td>
                <td className="p-4">{staff.email}</td>
                <td className="p-4">{staff.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}