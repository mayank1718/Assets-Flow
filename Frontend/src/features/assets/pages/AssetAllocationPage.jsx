import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  PageLayout,
  PageHeader,
  Card,
  BackLink,
} from "../../shared/components/AdminUI";

/**
 * AssetAllocationPage
 *
 * This page is registered in the router at /assets/:id/allocate.
 * Asset allocation requires a backend endpoint and handler that are not
 * yet present in the existing API service or context hook.
 *
 * Implement the allocation endpoint and add an `allocateAssetHandler`
 * to useAssets.js and asset.service.js before building the full form.
 */
const AssetAllocationPage = () => {
  const { id } = useParams();

  return (
    <PageLayout>
      <BackLink to={`/assets/${id}`} label="Back to Asset" />
      <PageHeader
        title="Allocate Asset"
        description="Assign this asset to a user or department."
      />

      <div className="max-w-2xl">
        <Card>
          <div className="px-6 py-10 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-amber-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-slate-800">
              Allocation Not Yet Implemented
            </h2>
            <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
              The asset allocation feature requires a backend{" "}
              <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">
                POST /api/assets/:id/allocate
              </code>{" "}
              endpoint and a corresponding{" "}
              <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">
                allocateAssetHandler
              </code>{" "}
              in <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">useAssets.js</code>.
              Once those are available, the form can be built here.
            </p>
            <div className="mt-6">
              <Link
                to={`/assets/${id}`}
                className="inline-flex items-center h-10 px-4 rounded-lg text-sm font-medium text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors duration-150"
              >
                Back to Asset
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
};

export default AssetAllocationPage;