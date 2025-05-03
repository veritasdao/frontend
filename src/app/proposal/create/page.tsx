import Form from "@/components/layout/proposal/create/form";
import React from "react";

export default function page() {
  return (
    <main className="space-y-5">
      <div className="text-center py-10">
        <h1 className="text-5xl font-bold mb-2">
          Turn Your Innovation Into Reality. Start Here!
        </h1>
        <h2 className="text-muted-foreground  mx-auto">
          Fill out the following form to submit a project proposal that's ready
          to be supported and realized together with Veritas DAO.
        </h2>
      </div>
      <Form />
    </main>
  );
}
