import Form from "@/components/layout/proposal/create/form";
import React from "react";

export default function page() {
  return (
    <main className="space-y-5">
      <div className="text-center py-10">
        <h1 className="text-5xl font-bold mb-2">
          Jadikan Inovasi Kamu Menjadi Kenyataan. Mulai dari Sini!
        </h1>
        <h2 className="text-muted-foreground  mx-auto">
          Isi formulir berikut untuk mengajukan proposal project yang siap
          didukung dan diwujudkan bersama Veritas DAO.
        </h2>
      </div>
      <Form />
    </main>
  );
}
