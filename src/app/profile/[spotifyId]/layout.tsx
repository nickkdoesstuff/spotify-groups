export default async function DashboardLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {

    return (
        <div className={`max-w-[750px] mx-auto mt-2 p-2`}>
          {children}
        </div>
    );
  }