import { HandCoins, Newspaper, Vote } from "lucide-react";
import React from "react";

export default function Flow() {
  return (
    <section className="border p-5 rounded-md">
      <h1 className="text-center font-bold text-4xl">Cara Kerja Veritas</h1>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mt-10">
        <div className="border p-5 shadow-inner shadow-black rounded-md space-y-3">
          <Newspaper size={50} />
          <h1 className="font-bold text-2xl"> Step 1 - Ajukan Proposal</h1>
          <p>
            Tulis ide atau project impianmu—baik itu proyek teknologi, sosial,
            atau komunitas. Tentukan target pendanaan dan ajukan langsung
            kemudian proposal akan tersimpan di smart contract yang dibangun di
            atas jaringan LISK.
          </p>
        </div>
        <div className="border p-5 bg-secondary shadow-inner shadow-black rounded-md space-y-3">
          <Vote size={50} />
          <h1 className="font-bold text-2xl">
            {" "}
            Step 2 - Voting & Donasi Komunitas
          </h1>
          <p>
            Proposal kamu akan terbuka untuk proses voting publik. Siapapun bisa
            memberikan suara menggunakan token IDRX sebagai bukti dukungan,
            sekaligus mendonasikan dana untuk mendukung realisasi ide tersebut.
          </p>
        </div>
        <div className="border p-5 border-[#1d4ed8] bg-[#1e40af] shadow-inner shadow-black rounded-md space-y-3">
          <HandCoins size={50} />
          <h1 className="font-bold text-2xl">Step 3 - Pendanaan & Eksekusi</h1>
          <p>
            Jika proposal lolos quorum, voting dan mencapai target dana, maka
            dana dapat dicairkan. Eksekusikan proyekmu—semua transparan dan
            tercatat di blockchain.
          </p>
        </div>
      </div>
      <div className="mt-10">
        <h1 className="text-4xl font-bold">Vote & Earn</h1>
        <p className="text-xl text-muted-foreground">
          Dukung proposal yang tepat, setiap voter mendapatkan bagian dari
          reward pool.
        </p>
      </div>
    </section>
  );
}
