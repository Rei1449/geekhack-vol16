import type { AppProps } from 'next/app';

declare module 'react' {
  interface StyleHTMLAttributes<T> extends React.HTMLAttributes<T> {
    jsx?: boolean;
    global?: boolean;
  }
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>
        {`
          html,
          body,
          #__next {
            height: 100%;
            margin: 0;
            padding: 0;
          }

          h1,
          h2,
          h3,
          h4,
          h5,
          h6 {
            margin: 0;
          }

          a {
            text-decoration: none;
            color: inherit;
            appearance: none;
          }

          a:hover {
            cursor: pointer;
            text-decoration: none !important;
            appearance: none;
          }

          ol,
          ul {
            list-style: none;
          }
        `}
      </style>
      <Component {...pageProps} />
    </>
  );
}
