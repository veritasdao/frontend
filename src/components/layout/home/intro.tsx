import React from "react";
import { Orbit } from "../../Orbit";
import { LinkPreview } from "../../ui/link-preview";
import { BoxReveal } from "../../magicui/box-reveal";

export default function Intro() {
  return (
    <section className="space-y-3">
      <h1 className="text-3xl 2xl:text-4xl font-bold">
        Revolusi Teknologi di Tanah Air Dimulai di Sini
      </h1>
      <div className="xl:text-xl text-muted-foreground leading-9">
        <strong className="text-primary text-2xl underline-offset-4 underline">
          Veritas
        </strong>{" "}
        adalah platform crowdfunding dan pendanaan publik berbasis donasi yang
        dibangun di atas jaringan{" "}
        <LinkPreview url="https://portal.lisk.com/" className="font-bold">
          LISK
        </LinkPreview>{" "}
        .<br />
        Kami memberdayakan{" "}
        <span className="text-primary font-medium">
          komunitas, developer, dan individu untuk mewujudkan proyek open-source
        </span>{" "}
        dan inisiatif sosial melalui sistem voting yang transparan menggunakan
        token{" "}
        <LinkPreview url="https://home.idrx.co/" className="font-bold">
          IDRX
        </LinkPreview>{" "}
        . Di Veritas, setiap suara berarti. Sistem insentif kami memberi reward
        bagi voter yang memilih dengan bijak, memastikan proses pengambilan
        keputusan yang adil dan bertanggung jawab. Bersama Veritas, kita bangun
        masa depan yang kolaboratif, terbuka, dan berdaya—satu proposal, satu
        vote, satu dampak nyata.
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 place-content-center place-items-center">
        <div className="grid gap-5">
          <div className="border border-[#1d4ed8] p-5 rounded-md">
            <BoxReveal boxColor={"#1d4ed8"} duration={0.5}>
              <h2 className="text-2xl font-semibold">
                Masuk ke Ekosistem Web3{" "}
              </h2>
            </BoxReveal>
            <BoxReveal boxColor={"#1d4ed8"} duration={1}>
              <p className="text-muted-foreground">
                Pelajari blockchain sambil membangun aplikasi nyata dengan
                menggunakan Token IDRX memberikan hak suara dalam keputusan DAO
                dan Dapatkan keuntungan dari pertumbuhan ekosistem
              </p>
            </BoxReveal>
          </div>
          <div className="border border-[#1d4ed8] p-5 rounded-md">
            <BoxReveal boxColor={"#1d4ed8"} duration={0.5}>
              <h2 className="text-2xl font-semibold">Transparansi Total</h2>
            </BoxReveal>
            <BoxReveal boxColor={"#1d4ed8"} duration={1}>
              <p className="text-muted-foreground">
                Semua keputusan pendanaan dan alokasi sumber daya diatur oleh
                smart contract dan voting komunitas.
              </p>
            </BoxReveal>
          </div>
          <div className="border border-[#1d4ed8] p-5 rounded-md">
            <BoxReveal boxColor={"#1d4ed8"} duration={0.5}>
              <h2 className="text-2xl font-semibold">Dukungan Berkelanjutan</h2>
            </BoxReveal>
            <BoxReveal boxColor={"#1d4ed8"} duration={1}>
              <p className="text-muted-foreground">
                Model pendanaan inovatif yang memastikan developer dapat fokus
                pada karya, bukan mencari dana.
              </p>
            </BoxReveal>
          </div>
          <div className="border border-[#1d4ed8] p-5 rounded">
            <BoxReveal boxColor={"#1d4ed8"} duration={0.5}>
              <h2 className="text-2xl font-semibold">Membangun Bersama</h2>
            </BoxReveal>
            <BoxReveal boxColor={"#1d4ed8"} duration={1}>
              <p className="text-muted-foreground">
                Gabungkan visi Anda dengan ribuan inovator teknologi lainnya di
                Indonesia untuk menciptakan dampak yang lebih besar.
              </p>
            </BoxReveal>
          </div>
        </div>
        <Orbit />
      </div>
    </section>
  );
}
