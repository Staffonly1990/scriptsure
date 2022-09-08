import { API_URL_SCRIPTSURE } from 'shared/config';
import { IAllergyDrugcheck, IInteractionAllergy, IInteractionDrugcheck } from '../allergy';
import request from '../request';
import { IDrugABC, IDrugDose, IFavoritesDrug, ISearchDrug } from './drug.list.types';
import { IFormatResponse } from './drug.types';

export const getNdc = (ndc: any) =>
  request<any>({
    url: `${API_URL_SCRIPTSURE}/v1.0/fdb/drug/ndc/${ndc}`,
    method: 'GET',
  });

export const search = (
  searchTerm?: string,
  searchMedication?: boolean,
  searchIndication?: boolean,
  searchOtc?: boolean,
  searchSupply?: boolean,
  searchStatus?: number,
  searchBrand?: boolean,
  searchGeneric?: boolean,
  includeCode = false
) =>
  request<{
    drugs?: ISearchDrug[];
    indications?: {
      DXID: number;
      MED_ROUTED_MED_ID_DESC: string;
    }[];
  }>({
    url: `${API_URL_SCRIPTSURE}/v1.0/druglist/search`,
    method: 'POST',
    body: {
      term: searchTerm,
      searchMedication,
      searchIndication,
      searchOtc,
      searchSupply,
      searchStatus,
      searchBrand,
      searchGeneric,
      includeCode,
    },
  });

/**
 * Get the current user's favorites
 * @returns {angular.IPromise<Drug[]>} Resolves to a list of drugs for a user to view.
 */
export const getFavorites = () =>
  request<IFavoritesDrug[]>({
    url: `${API_URL_SCRIPTSURE}/v1.0/druglist/favorites`,
    method: 'GET',
  });

/**
 * Get the indications and allergies based on the list of current drugs being taken by the patient.
 * @param currentDrugs List of currents drugs.
 * @param allergies List of allergies a patient has.
 * @param listDrugs List of drugs to check the currentDrugs.
 * @returns IPromise<IInteractionAllergy> Return an object containing a list of allergies and indications
 * for the provided list of drugs.
 */
export const getAllergies = (payload: {
  damAlrgnGrp?: number[];
  damAlrgnXsense?: number[];
  hicRoot?: number[];
  hicSeqn?: number[];
  listRoutedMedIds?: { routedMedId: number }[];
}) =>
  request<IAllergyDrugcheck[]>({
    url: `${API_URL_SCRIPTSURE}/v1.0/fdb/drugcheck/allergy`,
    method: 'POST',
    body: { ...payload },
  });
export const getInteractions = (payload: { currentRoutedMedIds?: { routedMedId: number }[]; listRoutedMedIds?: { routedMedId: number }[] }) =>
  request<IInteractionDrugcheck[]>({
    url: `${API_URL_SCRIPTSURE}/v1.0/fdb/drugcheck/interaction`,
    method: 'POST',
    body: { ...payload },
  });

/**
 * Get the drugList based on category
 * @returns {angular.IPromise<IDrug[]>} Resolves to a list of drugs for a user to view.
 */
export const getDrugList = (category: string) =>
  request<IDrugABC[]>({
    url: `${API_URL_SCRIPTSURE}/v1.0/druglist/${category}`,
    method: 'GET',
  });

/**
 * Gets the DrugUserFavorite entity based on the userId and ROUTED_MED_ID
 * @param userId - User identification
 * @param ROUTED_MED_ID - Medication identification
 * @returns {IPromise<T>}
 */
export const getFavorite = (userId: number, drugGroup: string, ROUTED_MED_ID: number) =>
  request<{
    userId: number;
    drugGroup: string;
    ROUTED_MED_ID: number;
    delivered: number;
  }>({
    url: `${API_URL_SCRIPTSURE}/v1.0/druglist/favorite/${userId}/${drugGroup}/${ROUTED_MED_ID}`,
    method: 'GET',
  });

/**
 * Get the list of formats for a drug based on the ROUTED_MED_ID. This will return the dosages base on
 * being grouped by line of FormatDrug table/model.
 * @param ROUTED_MED_ID The ROUTED_MED_ID of the selected drug.
 * @param doctorId The id of the current doctor to use for custom formats.
 * @returns angular.IPromise<IFormatResponse> Resolves to an IFormatResponse.
 */
export const getFormats = (ROUTED_MED_ID: number, doctorId: number, customOnly = false) =>
  request<IFormatResponse>({
    url: `${API_URL_SCRIPTSURE}/v1.0/drugformat/format/${doctorId}/${ROUTED_MED_ID}/${customOnly}`,
    method: 'GET',
  });

/**
 * Search returns all products based on ROUTED_MED_ID from cached list
 * @returns {Promise} - Get mesage details
 */
export const getOptimizerxProduct = (
  ROUTED_MED_ID: number // if (drug.offerid && drug.offerid > 0)
) =>
  request<
    {
      details: {
        description: string;
        url?: string;
      }[];
      title: string;
    }[]
  >({
    url: `${API_URL_SCRIPTSURE}/v1.0/coupon/optimizerx/product/${ROUTED_MED_ID}`,
    method: 'GET',
  });

/**
 * Get the list of doses for the medication
 * @param routedMedId - ROUTED_MED_ID identification number
 * @returns {Promise} - List of doses
 */
export const getDoses = (routedMedId: number) =>
  request<IDrugDose[]>({
    url: `${API_URL_SCRIPTSURE}/v1.0/fdb/drug/doses/${routedMedId}`,
    method: 'GET',
  });

/**
 * Get the Drugs used for a certain indication.
 * @param DXID The indication id.
 * @returns IPromise<any> Resolves to a list of drugs.
 */
export const getIndicationDrugs = (DXID: number) =>
  request<
    {
      ROUTED_MED_ID: number;
      MED_ROUTED_MED_ID_DESC: string;
      FormularyStatus: number;
    }[]
  >({
    url: `${API_URL_SCRIPTSURE}/v1.0/druglist/indication/drugs/${DXID}`,
    method: 'GET',
  });

/**
 * Get the list of brand name medications for a generic
 * @param routedMedId - ROUTED_MED_ID identification number
 * @returns {Promise} - List of medications
 */
export const getBrandMedications = (routedMedId: number) =>
  request<
    {
      ROUTED_MED_ID: number;
      MED_ROUTED_MED_ID_DESC: string;
    }[]
  >({
    url: `${API_URL_SCRIPTSURE}/v1.0/druglist/brand/${routedMedId}`,
    method: 'GET',
  });

/**
 * Get the list of generic name medications for a brand
 * @param routedMedId - ROUTED_MED_ID identification number
 * @returns {Promise} - List of medications
 */
export const getGenericMedications = (routedMedId: number) =>
  request<
    {
      ROUTED_MED_ID: number;
      MED_ROUTED_MED_ID_DESC: string;
    }[]
  >({
    url: `${API_URL_SCRIPTSURE}/v1.0/druglist/generic/${routedMedId}`,
    method: 'GET',
  });

/**
 * Returns an array of Pemono Codes and the Drug Name associated with them.
 * @method scriptsure.services.drugInfoPatientInformationService#getDrugInformationList
 * @param {number} routedMedId The routed med id from surescripts.
 * @returns {angular.IPromise<IPatientInformation[]>} Resolves to ...
 */
export const getDrugInformationList = (routedMedId: number) =>
  request<
    {
      dgname: string;
      pemono: number;
    }[]
  >({
    url: `${API_URL_SCRIPTSURE}/v1.0/fdb/druginfo/patientinfo/${routedMedId}`,
    method: 'GET',
  });
