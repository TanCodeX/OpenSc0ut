import React from "react";
import Head from "next/head";

interface UICollectionLayoutProps {
  children: React.ReactNode;
  metaTitle: string;
  keywords: string;
}

const UICollectionLayout: React.FC<UICollectionLayoutProps> = ({
  children,
  metaTitle,
  keywords,
}) => {
  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaTitle} />
        <meta name="keywords" content={keywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen bg-black text-white">
        {children}
      </div>
    </>
  );
};

export default UICollectionLayout;
