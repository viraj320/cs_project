import { Link } from "react-router-dom";

export default function UsefulLinks() {
  return (
    <div className="mb-6 md:mb-0">
      <h3 className="text-gray-800 font-semibold mb-4 text-lg">Useful Links</h3>
      <ul className="space-y-2">
        <li>
          <Link to="/aboutus" className="text-gray-600 hover:text-blue-600">About Us</Link>
        </li>
        <li>
          <Link to="/contactus" className="text-gray-600 hover:text-blue-600">Contact Us</Link>
        </li>
        <li>
          <Link to="/" className="text-gray-600 hover:text-blue-600">Home</Link>
        </li>
        <li>
          <Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
        </li>
        <li>
          <Link to="/spareparts" className="text-gray-600 hover:text-blue-600">Spare Parts</Link>
        </li>
      </ul>
    </div>
  );
}
  