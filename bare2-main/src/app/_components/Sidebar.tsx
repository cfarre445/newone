import Link from "next/link";
import SignOutButton from './SignOutButton'
const Sidebar = () => {
  return (
    <nav className="w-64 h-screen bg-[#15162c] text-white top-0 left-0 p-4 fixed z-50">
      <h2 className="text-xl font-bold mb-4">App navigation</h2>
      <ul className="space-y-3">
        <li>
          <Link href="./" className="hover:bg-white/20 block p-2 rounded">
            Home
          </Link>
        </li>
        <li>
          <Link href="./upload" className="hover:bg-white/20 block p-2 rounded">
            Upload Data
          </Link>
        </li>
        <li>
          <Link href="./results" className="hover:bg-white/20 block p-2 rounded">
            Download Results
          </Link>
        </li>
        <li>
          <Link href="./rshiny" className="hover:bg-white/20 block p-2 rounded">
            LENSviz
          </Link>
        </li>
        <li>
          <Link href="./java_viz" className="hover:bg-white/20 block p-2 rounded">
            JavaViz
          </Link>
        </li>
        <li>
            <SignOutButton />
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
