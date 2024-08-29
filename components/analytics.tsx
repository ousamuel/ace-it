import React from 'react';
import Script from 'next/script';

const GoogleAnalytics = () => {
  return (
    <>
        <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=G-15T6ZRT6DS`}
      />
       <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-15T6ZRT6DS', {
              page_path: window.location.pathname,
            });
          `,
          }}
        />      
    </>
  );
};

export default GoogleAnalytics;