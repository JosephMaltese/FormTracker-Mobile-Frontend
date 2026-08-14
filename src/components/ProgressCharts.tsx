import { View, Text, StyleSheet } from 'react-native';
import PeriodSelector, {ProgressPeriod} from "@/components/PeriodSelector";
import ProgressChart from "@/components/ProgressChart";
import {useState} from "react";

export default function ProgressCharts() {
    const [period, setPeriod] = useState<ProgressPeriod>("7d");
    return (
        <View style={styles.outerView}>
            <View style={styles.headingView}>
                <Text style={styles.titleText}>Form Progress</Text>
                <PeriodSelector value={period} onChange={setPeriod} />
            </View>
            <View style={styles.chartView}>
                <ProgressChart
                    exerciseName={"Chest Press"}
                    average={75}
                    data={[
                        {value: 50, label: 'Mon'},
                        {value: 70, label: 'Tues'},
                        {value: 77, label: 'Wed'},
                        {value: 75, label: 'Thurs'},
                        {value: 82, label: 'Fri'},
                        {value: 83, label: 'Sat'}
                    ]}
                />
            </View>
            <View style={styles.chartView}>
                <ProgressChart
                    exerciseName={"Bicep Curl"}
                    average={78}
                    data={[
                        {value: 43, label: 'Mon'},
                        {value: 55, label: 'Tues'},
                        {value: 77, label: 'Wed'},
                        {value: 72, label: 'Thurs'},
                        {value: 80, label: 'Fri'},
                        {value: 90, label: 'Sat'}
                    ]}
                />
            </View>
            <View style={styles.chartView}>
                <ProgressChart
                    exerciseName={"Squat"}
                    average={67}
                    data={[
                        {value: 40, label: 'Mon'},
                        {value: 44, label: 'Tues'},
                        {value: 55, label: 'Wed'},
                        {value: 45, label: 'Thurs'},
                        {value: 70, label: 'Fri'},
                        {value: 78, label: 'Sat'}
                    ]}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    outerView: {
        marginTop: 20
    },
    headingView: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10
    },
    titleText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    chartView: {
        marginBottom: 20,
    },
});