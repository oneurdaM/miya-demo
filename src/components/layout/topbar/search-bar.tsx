/* eslint-disable @typescript-eslint/no-explicit-any */
import {SearchIcon} from '@/components/icons/search-icon';
import Link from '@/components/ui/link';
import Scrollbar from '@/components/ui/scrollbar';
import cn from 'classnames';
import {isEmpty} from 'lodash';
import {useTranslation} from 'next-i18next';
import {Fragment,useState} from 'react';
import {ChildMenu} from '@/utils/searched-url';
import {TermsIcon} from '@/components/icons/sidebar/terms';

const SearchBar: React.FC = () => {
  const {t} = useTranslation();
  const initialItem: ChildMenu[] = [];
  const [searchText,setSearchText] = useState('');
  const [searchItem,setSearchItem] = useState(initialItem);


  return (
    <Fragment>
      <div
        className={cn('fixed inset-0',searchText === '' && 'hidden')}
        onClick={() => setSearchText('')}
      />
      <div className="relative w-full max-w-lg rounded-3xl">
        <SearchIcon className="absolute inset-y-0 left-4 my-auto h-4 w-4" />
        <input
          type="text"
          className="block w-full rounded-3xl border border-solid border-border-200 bg-gray-50 py-2 text-sm text-heading transition-[border] placeholder:text-gray-400 focus:border-accent focus:bg-white focus:outline-none focus:ring-0 ltr:pl-12 rtl:pr-12 sm:text-sm sm:leading-6"
          placeholder={t('text-top-bar-search-placeholder') ?? 'Buscar...'}
          value={searchText}
        />
        {!isEmpty(searchItem) && (
          <button
            className="absolute top-1/2 h-auto w-auto -translate-y-1/2 px-0 text-sm font-medium text-gray-500 hover:text-accent-hover ltr:right-4 rtl:left-4"
            onClick={(e) => {
              e.preventDefault();
              setSearchText('');
            }}
          >
            {t('text-clear')}
          </button>
        )}
      </div>

      {!isEmpty(searchItem) ? (
        <div className="sidebar-scrollbar absolute top-12 z-30 h-[418px] max-h-[418px] w-full max-w-lg rounded-xl border border-solid border-gray-200 bg-white py-4 shadow-box lg:top-[74px]">
          <Scrollbar
            className="max-h-full w-full"
            options={{
              scrollbars: {
                autoHide: 'never',
              },
            }}
          >
            <div className="flex flex-col">
              <h4 className="px-6 pb-2 text-sm font-medium text-black xl:text-base">
                {t('text-quick-page-links')}
              </h4>
              <div className="mx-3">
                {searchItem?.map((item) => {
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => {
                        setSearchItem([]);
                        setSearchText('');
                      }}
                      className="group flex items-center rounded-lg py-2.5 px-3 text-sm text-gray-700 transition duration-200 ease-in-out hover:bg-gray-100 hover:text-heading"
                    >
                      <span className="inline-flex shrink-0 items-center justify-center rounded-md border border-gray-200 p-2 text-gray-500 group-hover:border-gray-300">
                        <TermsIcon className="h-5 w-5" />
                      </span>
                      <div className="flex flex-col ltr:pl-3 rtl:pr-3">
                        <span className="whitespace-nowrap font-medium capitalize">
                        </span>
                        <span className="text-gray-500">{item?.href}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </Scrollbar>
        </div>
      ) : null}
    </Fragment>
  );
};

export default SearchBar;
