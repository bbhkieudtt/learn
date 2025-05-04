<template>
    <div class="h-dvh w-dvw flex flex-col overflow-hidden">
        <header class="bg-green px-3 py-4 flex flex-col gap-5">
            <div class="flex justify-between text-xl font-medium text-white">
                <img @click="goHome" :src="logoPick" alt="Logo" class="w-10 h-10 rounded-full">
                <p>Thống kê doanh thu</p>
                <p></p>
            </div>
            <div class="grid grid-cols-2 gap-8">
                <div class="flex items-center justify-between text-lg cursor-pointer button rounded-md">
                    <List_Yard></List_Yard>
                </div>
                <div class="flex items-center justify-between text-lg cursor-pointer button rounded-md">
                    <TimeFilter></TimeFilter>
                </div>
            </div>
        </header>

        <main class="flex flex-col h-full pt-8 gap-6 px-6 bg-gray-50">
            <h4 class="text-center text-2xl font-semibold text-green-900">
                Thống kê sân từ ngày {{ formatDate(store.storeDate?.[0]) }} 
                đến ngày {{ formatDate(store.storeDate?.[1]) }}
            </h4>

            <div class="overflow-x-auto rounded-xl shadow-lg">
                <table v-if="list_chill" class="min-w-full bg-white border-separate border-spacing-0 rounded-xl">
                    <thead>
                        <tr class="bg-green-800 text-white">
                            <th class="py-4 px-6 text-left font-semibold rounded-tl-xl">Sân</th>
                            <th class="py-4 px-6 text-left font-semibold">Tổng lịch đã hoàn thành</th>
                            <th class="py-4 px-6 text-left font-semibold">Tổng lịch chưa hoàn thành</th>
                            <th class="py-4 px-6 text-left font-semibold">Tổng tiền đã hoàn thành</th>
                            <th class="py-4 px-6 text-left font-semibold">Tiền đã thanh toán (95%)</th>
                            <th class="py-4 px-6 text-left font-semibold rounded-tr-xl">Tổng tiền chưa hoàn thành</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in courtsWithBookingInfo" :key="index"
                            class="hover:bg-green-50 transition-colors">
                            <td class="py-4 px-6 border-t border-gray-200">{{ item.name }}</td>
                            <td class="py-4 px-6 border-t border-gray-200">{{ item.total_completed_booking }}</td>
                            <td class="py-4 px-6 border-t border-gray-200">{{ item.total_uncompleted_booking }}</td>
                            <td class="py-4 px-6 border-t border-gray-200 font-semibold">{{ formatCurrency(item.total_price_completed) }}</td>
                            <td class="py-4 px-6 border-t border-gray-200 font-semibold">{{ formatCurrency(item.total_price_paid) }}</td>
                            <td class="py-4 px-6 border-t border-gray-200 font-semibold">{{ formatCurrency(item.total_price_uncompleted) }}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr class="bg-gray-100">
                            <td class="py-4 px-6 font-bold rounded-bl-xl">Tổng</td>
                            <td class="py-4 px-6 font-bold">{{ totalCompletedBookings }}</td>
                            <td class="py-4 px-6 font-bold">{{ totalUncompletedBookings }}</td>
                            <td class="py-4 px-6 font-bold">{{ formatCurrency(totalPriceAllCourts) }}</td>
                            <td class="py-4 px-6 font-bold">{{ formatCurrency(totalPricePaidAllCourts) }}</td>
                            <td class="py-4 px-6 font-bold rounded-br-xl">{{ formatCurrency(totalPriceUncompletedAllCourts) }}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div class="flex justify-end px-4 text-xl gap-2 text-green-900 font-bold pt-4 pb-6">
                <CurrencyDollarIcon class="w-7 h-7 text-yellow-600"></CurrencyDollarIcon>
                <p>Tổng doanh thu: <span class="text-yellow-600">{{ formatCurrency(totalPriceAllCourts) }}</span></p>
                <CurrencyDollarIcon class="w-7 h-7 text-yellow-600 ml-4"></CurrencyDollarIcon>
                <p>Doanh thu sau phí (95%): <span class="text-yellow-600">{{ formatCurrency(totalPricePaidAllCourts) }}</span></p>
            </div>
        </main>

        <Modal v-if="store.show_modal" :close="showModal">
            <template #content>
                <div class="w-[300px] h-[300px]">
                    <VueDatePicker class="w-full h-full" v-model="store.storeDate" :inline="true" auto-apply locale="vi" range />
                </div>
            </template>
        </Modal>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/appStore'
import logoPick from "@/assets/imgs/logoPick.png"
import { CurrencyDollarIcon } from "@heroicons/vue/24/solid"
import List_Yard from './List_Yard.vue'
import TimeFilter from '../FilterYard/TimeFilter.vue'
import Modal from "@/components/Modal/Modal.vue"
import { apiGetChillCourt } from "@/service/api/apiChillCourt"
import { apiGetPayment } from "@/service/api/apiPayment"
import { apiGetListBooking } from "@/service/api/apiBoking"
import type { CourtEvent } from '@/interface'
import { useAppStoreCourt } from '@/stores/appStoreCourt'

const router = useRouter()
const store = useAppStore()
const store_court = useAppStoreCourt()
const list_boking = ref<CourtEvent[]>([])

onMounted(async () => {
    await getChillCourt()
    await getListBoking()
    await getPayment()

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0)
    store.storeDate = [startOfMonth, endOfNextMonth]
})

const list_chill = computed(() => {
    return store_court.list_chill_court 
        ? store_court.list_chill_court.filter(court => court.courtId === store_court.court_detail?.id) 
        : []
})

const courtsWithBookingInfo = computed(() => {
    const listChillArray = list_chill.value || []
    const listBokingArray = list_boking.value || []
    const dateRange = store.storeDate || []
    const today = new Date()

    if (listChillArray.length === 0) return []
    
    return listChillArray.map(child => {
        const bookingsForCourt = listBokingArray.filter(booking => {
            const bookingTime = new Date(booking.startTime)
            const isCorrectCourt = booking.childCourtId === child.id
            const isStatus2or5 = booking.status === 2 || booking.status === 5
            const inDateRange = Array.isArray(dateRange) && dateRange.length === 2
                ? bookingTime >= new Date(dateRange[0]) && bookingTime <= new Date(dateRange[1])
                : true
            return isCorrectCourt && isStatus2or5 && inDateRange
        })

        const completedBookings = bookingsForCourt.filter(booking => {
            const bookingTime = new Date(booking.startTime)
            return (booking.status === 2 || booking.status === 5) && bookingTime <= today
        })
        const uncompletedBookings = bookingsForCourt.filter(booking => {
            const bookingTime = new Date(booking.startTime)
            return (booking.status === 2 || booking.status === 5) && bookingTime > today
        })

        const total_completed_booking = completedBookings.length
        const total_uncompleted_booking = uncompletedBookings.length
        const total_price_completed = completedBookings.reduce((sum, booking) => {
            const price = Number(booking.price) || 0
            return sum + price
        }, 0)
        const total_price_paid = completedBookings
            .filter(booking => booking.status === 5)
            .reduce((sum, booking) => {
                const price = Number(booking.price) || 0
                return sum + price * 0.95
            }, 0)
        const total_price_uncompleted = uncompletedBookings.reduce((sum, booking) => {
            const price = Number(booking.price) || 0
            return sum + price
        }, 0)

        return {
            name: child.childCourtName,
            total_completed_booking,
            total_uncompleted_booking,
            total_price_completed,
            total_price_paid,
            total_price_uncompleted,
        }
    })
})

const totalCompletedBookings = computed(() => {
    return courtsWithBookingInfo.value.reduce((sum, court) => sum + court.total_completed_booking, 0)
})

const totalUncompletedBookings = computed(() => {
    return courtsWithBookingInfo.value.reduce((sum, court) => sum + court.total_uncompleted_booking, 0)
})

const totalPriceAllCourts = computed(() => {
    const total = courtsWithBookingInfo.value.reduce((sum, court) => {
        const price = Number(court.total_price_completed) || 0
        return sum + price
    }, 0)
    return isNaN(total) ? 0 : total
})

const totalPricePaidAllCourts = computed(() => {
    const total = courtsWithBookingInfo.value.reduce((sum, court) => {
        const price = Number(court.total_price_paid) || 0
        return sum + price
    }, 0)
    return isNaN(total) ? 0 : total
})

const totalPriceUncompletedAllCourts = computed(() => {
    const total = courtsWithBookingInfo.value.reduce((sum, court) => {
        const price = Number(court.total_price_uncompleted) || 0
        return sum + price
    }, 0)
    return isNaN(total) ? 0 : total
})

function showModal() {
    store.show_modal = false
}

function goHome() {
    router.push('/main')
}

async function getChillCourt() {
    try {
        const response = await apiGetChillCourt()
        if (response && response.status === 200) {
            store_court.list_chill_court = response.data
        }
    } catch (error) {
        console.error("API Error:", error)
    }
}

async function getPayment() {
    try {
        const response = await apiGetPayment()
        if (response && response.status === 200) {
           console.log('response',response);
        }
    } catch (error) {
        console.error("API Error:", error)
    }
}

async function getListBoking() {
    try {
        const response = await apiGetListBooking()
        if (response && response.status === 200) {
            list_boking.value = response.data
            console.log('List of bookings:', list_boking.value)
        }
    } catch (error) {
        console.error("API Error:", error)
    }
}

const formatCurrency = (value: number) => {
    if (isNaN(value)) return '0 đ'
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(value)
}

function formatDate(date: Date | undefined) {
    if (!date) return ''
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })
}
</script>

<style scoped>
table {
    border-collapse: separate;
    border-spacing: 0;
}

th, td {
    border-right: none !important;
}

th {
    background: linear-gradient(to bottom, #15803d, #166534);
    color: white;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

tbody tr:last-child td {
    border-bottom: none;
}

tbody tr:nth-child(even) {
    background-color: #f9fafb;
}

tfoot td {
    background: #e6f4ea;
    color: #15803d;
}

td, th {
    text-align: center !important;
}

tr {
    transition: all 0.2s ease-in-out;
}

tr:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>