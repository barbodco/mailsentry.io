import { Response } from "@/interface";

const EmailValidation = ({ list }: { list: Response }) => {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      {list.data.map((item, index) => (
        <div key={index} className="bg-gray-100 shadow-lg rounded-lg p-6 mb-4">
          <p className={`text-sm font-medium ${item.valid ? "text-green-600" : "text-red-600"}`}>
            Reason: {item.reason}
          </p>
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-800">Validators:</h3>
            <ul className="list-disc pl-5">
              {Object.entries(item.validators).map(([key, value]) => (
                <li key={key} className={`${value.valid ? "text-green-600" : "text-red-600"} font-medium`}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}: {value.valid ? "Valid" : "Invalid"}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmailValidation;
