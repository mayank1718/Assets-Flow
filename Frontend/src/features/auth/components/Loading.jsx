const Loading = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FCFCF8]">
      <div className="flex flex-col items-center gap-6">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600 shadow-sm" />

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          <p className="text-sm font-semibold tracking-wide text-slate-700">
            Loading AssetFlow...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loading;
