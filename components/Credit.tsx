import React from "react";
import Link from "next/link";

interface CreditProps {
  inspiredLink: string;
  inspiredName: string;
  codeRefLink: string;
  codeRefName: string;
  githubLink: string;
}

const Credit: React.FC<CreditProps> = ({
  inspiredLink,
  inspiredName,
  codeRefLink,
  codeRefName,
  githubLink,
}) => {
  return (
    <div className="mt-8 text-sm text-gray-400">
      <p>
        Inspired by{" "}
        <Link
          href={inspiredLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          {inspiredName}
        </Link>
      </p>
      <p>
        Code reference:{" "}
        <Link
          href={codeRefLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-400 hover:text-amber-300 transition-colors"
        >
          {codeRefName}
        </Link>
      </p>
      <p>
        GitHub:{" "}
        <Link
          href={githubLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-400 hover:text-purple-300 transition-colors"
        >
          View Source
        </Link>
      </p>
    </div>
  );
};

export default Credit;
