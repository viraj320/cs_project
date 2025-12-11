import garageLogo from '../../assets/Garage.PNG';

export default function CompanyInfo() {
  return (
    <div className="mb-6 md:mb-0">
      <div className="flex items-center mb-4">
        {/* Garage Logo */}
        <img 
          src={garageLogo} 
          alt="Garage Logo" 
          className="h-12 w-auto"
        />
      </div>
      <div className="text-gray-600 mb-1">Address: No:200,</div>
      <div className="text-gray-600 mb-1">Manikpuraya, 1 st Lane</div>
      <div className="text-gray-600 mb-1">New Town, Embilipitiya</div>
      <div className="text-gray-600 mb-1">Phone: 047-9892752</div>
      <div className="text-gray-600">Email: vehiclespare@gmail.com</div>
    </div>
  );
}