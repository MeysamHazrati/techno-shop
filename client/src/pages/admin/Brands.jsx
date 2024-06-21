import { useState, useRef, useContext, useEffect } from "react";
import { ToastContext } from "../../contexts/Toast";
import useBrands from "../../hooks/brand/useBrands";
import useCreateBrand from "../../hooks/brand/useCreateBrand";
import InfiniteScroll from "../../components/InfiniteScroll";
import Brand from "../../components/admin/Brand";
import BrandSkeleton from "../../components/admin/BrandSkeleton";
import NoResultFound from "../../components/NoResultFound";
import Loader from "../../components/Loader";

const Brands = () => {
  const [name, setName] = useState("");
  const [englishName, setEnglishName] = useState("");
  const [logo, setLogo] = useState(null);

  const image = useRef();
  const file = useRef();

  const { openToast } = useContext(ToastContext);

  const { isFetchingBrands, isBrandsError, brands, total, hasBrandsNextPage, fetchBrandsNextPage } = useBrands(20);
  const { isPendingCreateBrand, createBrand } = useCreateBrand();

  useEffect(() => {
    document.title = "تکنوشاپ - مدیریت - برند ها";
  }, []);

  const submit = (event) => {
    event.preventDefault();

    if (name.trim().length >= 3 && name.trim().length <= 50) {
      if (englishName.trim().length >= 3 && englishName.trim().length <= 50) {
        if (logo ? logo.type === "image/png" || logo.type === "image/jpg" || logo.type === "image/jpeg" : true) {
          createBrand({ name: name.trim(), englishName: englishName.trim(), logo }, { onSuccess: () => {
            setName("");
            setEnglishName("");
            setLogo(null);
            image.current.src = "";
            file.current.value = null;
          } });
        } else {
          openToast("error", null, "فرمت عکس باید PNG یا JPG یا JPEG باشد.");
        }
      } else {
        openToast("error", null, "نام انگلیسی باید بین 3 تا 50 حروف باشد.");
      }
    } else {
      openToast("error", null, "نام باید بین 3 تا 50 حروف باشد.");
    }
  };

  return (
    <>
      <h6 className="font-vazirmatn-bold text-xl">ثبت برند جدید</h6>
      <form className="mt-4 text-lg" onSubmit={submit}>
        <div className="flex items-center gap-x-4">
          <div className="size-32 shrink-0 cursor-pointer" onClick={() => file.current.click()}>
            {file.current?.files.length ? <img ref={image} alt="Brand Logo" loading="lazy" className="size-full rounded-full object-cover" /> : <div className="flex size-full items-center justify-center rounded-full border border-zinc-200 text-zinc-400">لوگو</div>}
            <input
              ref={file}
              type="file"
              accept="image/png, image/jpg, image/jpeg"
              className="hidden"
              onChange={({ target }) => {
                if (target.files[0]) {
                  const reader = new FileReader();

                  reader.addEventListener("load", ({ target }) => (image.current.src = target.result));

                  reader.readAsDataURL(target.files[0]);

                  setLogo(target.files[0]);
                }
              }}
            />
          </div>
          <div className="flex w-full flex-col gap-y-4">
            <input
              type="text"
              value={name}
              placeholder="نام"
              className="h-14 rounded-3xl border border-zinc-200 px-4 text-lg outline-none placeholder:text-zinc-400"
              onInput={({ target }) => setName(target.value)}
            />
            <input
              type="text"
              value={englishName}
              placeholder="نام انگلیسی"
              className="h-14 rounded-3xl border border-zinc-200 px-4 text-lg outline-none placeholder:text-zinc-400"
              onInput={({ target }) => setEnglishName(target.value)}
            />
          </div>
        </div>
        <button disabled={isPendingCreateBrand} className="mt-4 flex h-14 w-full items-center justify-center text-nowrap rounded-full bg-primary-900 text-white transition-colors enabled:hover:bg-primary-800">
          {isPendingCreateBrand ? <Loader width={"40px"} height={"10px"} color={"#ffffff"} /> : "ثبت"}
        </button>
      </form>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-vazirmatn-bold text-xl">برند ها</h2>
        <span className="mr-auto text-zinc-500">{isFetchingBrands || isBrandsError ? 0 : total.toLocaleString()} برند</span>
      </div>
      {isBrandsError ? (
        <NoResultFound title="برندی پیدا نشد!" className="mt-4" />
      ) : (
        <div className="mt-4 overflow-auto rounded-3xl border border-zinc-200">
          <table className="w-full text-nowrap text-lg">
            <thead className="bg-zinc-200">
              <tr className="[&>*]:h-[72px] [&>*]:px-5 [&>*]:font-vazirmatn-medium [&>*]:font-normal">
                <th>لوگو</th>
                <th>نام</th>
                <th>نام انگلیسی</th>
                <th></th>
              </tr>
            </thead>
            <InfiniteScroll hasNextPage={hasBrandsNextPage} fetchNextPage={fetchBrandsNextPage}>
              <tbody>
                {brands?.map((brand) => <Brand key={brand._id} {...brand} />)}
                {isFetchingBrands && Array(20).fill(0).map((brand, index) => <BrandSkeleton key={index} />)}
              </tbody>
            </InfiniteScroll>
          </table>
        </div>
      )}
    </>
  );
};

export default Brands;