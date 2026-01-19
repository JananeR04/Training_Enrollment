const EnrollmentList = ({ enrollments, trainingTitle }) => {
  if (enrollments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No enrollments yet
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h4 className="font-medium text-gray-700 mb-3">
        Enrolled Students ({enrollments.length})
      </h4>
      <div className="space-y-2">
        {enrollments.map((enrollment) => (
          <div
            key={enrollment.id}
            className="bg-gray-50 p-3 rounded-md flex justify-between items-center"
          >
            <div>
              <p className="font-medium text-gray-800">{enrollment.employee.name}</p>
              <p className="text-sm text-gray-600">{enrollment.employee.email}</p>
            </div>
            <span className="text-xs text-gray-500">
              {new Date(enrollment.enrolledAt).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnrollmentList;