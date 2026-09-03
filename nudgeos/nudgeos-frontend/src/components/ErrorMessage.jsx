export default function ErrorMessage({ message = "Something went wrong." }) {
  return (
    <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded">
      {message}
    </div>
  );
}
